const formatBoldText = (text) => {
    return text.split('**').map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };
  
  export const generateNotificationMessage = (notification) => {
    const { type, actor, article, comment, metadata } = notification;
  
    const count = metadata?.count || 1;
    const actorName = actor?.fullName || "Ai đó";
    const articleTitle = article?.title || "bài viết";
    
    const parentCommentSnippet = comment?.content 
      ? `"${comment.content.substring(0, 30)}..."` 
      : "bình luận của bạn";
  
    let others = "";
    if (count > 1) {
      others = ` và ${count - 1} người khác`;
    }
  
    let message;
    switch (type) {
      case 'like':
        message = `**${actorName}**${others} đã thích bài viết: **${articleTitle}**`;
        break;
      case 'comment':
        message = `**${actorName}**${others} đã bình luận về bài viết: **${articleTitle}**`;
        break;
      case 'reply':
        message = `**${actorName}**${others} đã trả lời ${parentCommentSnippet}`;
        break;
      case 'follow':
        message = `**${actorName}** đã bắt đầu theo dõi bạn.`;
        break;
      case 'new_article_from_followed':
        message = `**${actorName}** đã đăng một bài viết mới: **${articleTitle}**`;
        break;
      default:
        message = "Bạn có thông báo mới.";
    }
  
    return formatBoldText(message);
  };

  export const getNotificationLink = (notification) => {
    if (notification.type === "like" || notification.type === "comment" || notification.type === "reply") {
      return `/news/${notification.article?.slug}`;
    }
    if (notification.type === "follow") {
      return `/profile/${notification.actor?.id}`;
    }
    return "#";
  };