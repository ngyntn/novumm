import os

import joblib
import numpy as np
from elasticsearch import Elasticsearch
from preprocess.eng_processor import clean_text

ES_URL = os.getenv("ES_URL", 'http://localhost:9200')
print(f'[Query.py] Get ES_URL from .env ${ES_URL}')
es = Elasticsearch([ES_URL])

# Load models để transform text query
vectorizer = joblib.load('model/tfidf_model.pkl')
svd = joblib.load('model/svd_model.pkl')

TARGET_DIMS = 1000




def transform_query_to_vector(query_text):
    cleaned_query = clean_text(query_text)
    query_tfidf = vectorizer.transform([cleaned_query])
    query_reduced = svd.transform(query_tfidf)

    current_dims = query_reduced.shape[1]
    if current_dims < TARGET_DIMS:
        padding = np.zeros((query_reduced.shape[0], TARGET_DIMS - current_dims))
        query_reduced = np.hstack((query_reduced, padding))

    return query_reduced[0].tolist()


def correct_typo_with_es(text_query):
    # Gọi Elasticsearch để tìm từ đúng có thực sự tồn tại trong DB bài viết
    resp = es.search(
        index="articles",
        body={
            "suggest": {
                "text": text_query,
                "simple_phrase": {
                    "phrase": {
                        "field": "title",  # Tìm lỗi sai dựa trên field Title
                        "size": 1,
                        "confidence": 0.0,
                        "real_word_error_likelihood": 0.95,
                        "max_errors": 2,
                    }
                }
            }
        }
    )

    # Lấy từ gợi ý đầu tiên nếu có
    try:
        suggestions = resp['suggest']['simple_phrase'][0]['options']
        if suggestions:
            corrected_text = suggestions[0]['text']
            print(f"ES Corrected: '{text_query}' -> '{corrected_text}'")
            return corrected_text
    except:
        pass

    return text_query

def knn_text_search(query_text, top_k=5, index_name="articles"):
    query_text = correct_typo_with_es(query_text)
    print(f"Correct query: {query_text}")
    # Transform query thành vector
    query_vector = transform_query_to_vector(query_text)
    print(f"Query vector shape: {len(query_vector)} dims")

    query = {
        "field": "vector",
        "query_vector": query_vector,
        "k": top_k,
        "num_candidates": 100
    }

    response = es.search(
        index=index_name,
        knn=query,
        _source=["id", "title"],
        size = top_k
    )

    # In kết quả
    results = []
    print(f"\n Results for top_k {top_k} :{query_text}")
    for hit in response["hits"]["hits"]:
        article_id = hit["_source"].get("id", "")
        title = hit["_source"]["title"]
        score = hit["_score"]
        print(f"- {title} (score={score:.4f})")

        results.append({
            "id": article_id,
            "title": title,
            "score": round(score, 4)
        })

    return results


if __name__ == "__main__":
    search_query = ""
    print(f"Searching for: '{search_query}'")

    recs = knn_text_search(search_query, top_k=5)