import React, { useState, useMemo, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { uploadMedia } from "../api/articleApi";

export const useArticleForm = (initialData = {}) => {
  const dispatch = useDispatch();
  const quillRef = useRef();

  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [readTimeMinutes, setReadTimeMinutes] = useState(
    initialData.readTimeMinutes || 5
  );
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    initialData.thumbnailUrl || ""
  );

  const initialTags = initialData.tags
    ? initialData.tags
        .map((tag) => {
          if (typeof tag === "object" && tag !== null && tag.name) {
            return tag.name.trim();
          }
          if (typeof tag === "string") {
            return tag.trim();
          }
          return "";
        })
        .filter(Boolean)
    : [];
  const [tags, setTags] = useState(initialTags);
  const [currentTag, setCurrentTag] = useState("");

  const mediaHandler = useCallback(
    async (type) => {
      const quillInstance = quillRef.current;
      if (!quillInstance) {
        toast.error("Error: Editor not found.");
        return;
      }

      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", type === "image" ? "image/*" : "video/*");
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("media_file", file);
        const loadingToast = toast.loading(`Uploading ${type}...`);

        try {
          const result = await dispatch(uploadMedia(formData)).unwrap();
          const mediaUrl = result.url;
          const quill = quillInstance.getEditor();
          const range = quill.getSelection(true);

          quill.insertEmbed(range.index, type, mediaUrl);
          quill.setSelection(range.index + 1);
          toast.success(`Upload ${type} successful!`, { id: loadingToast });
        } catch (error) {
          toast.error(`Upload ${type} failed.`, { id: loadingToast });
        }
      };
    },
    [dispatch]
  );

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const rawTag = currentTag.trim();
      const normalizedTag = rawTag
        .toLowerCase()       
        .replace(/\s+/g, ''); 
      if (normalizedTag && !tags.includes(normalizedTag)) {
        setTags([...tags, normalizedTag]); 
      }
      setCurrentTag(""); 
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: () => mediaHandler("image"),
          video: () => mediaHandler("video"),
        },
      },
    }),
    [mediaHandler]
  );

  return {
    title,
    content,
    readTimeMinutes,
    thumbnail,
    thumbnailPreview,
    tags,
    currentTag,
    quillRef,
    modules,

    setTitle,
    setContent,
    setReadTimeMinutes,
    setThumbnail, 
    setThumbnailPreview, 
    setTags, 
    setCurrentTag,

    handleThumbnailChange,
    removeThumbnail,
    handleTagKeyDown,
    removeTag,
  };
};
