exports.formatTime = (articles) => {
  const formattedArticles = articles.map((article) => {
    const newDate = new Date(article.created_at);
    const formattedArticle = { ...article, created_at: newDate };
    return formattedArticle;
  });
  return formattedArticles;
};

exports.makeRefObj = (objectArr, key1, key2) => {
  const refObj = {};
  objectArr.forEach(element => {
    refObj[element[key1]] = element[key2]
  })
  return refObj;
};

exports.formatComments = (commentsArr, refObj) => {
 const formattedComments = commentsArr.map((comment) => {
   const formattedComment = {
     ...comment, 
     author: comment.created_by, 
     article_id: refObj[comment.belongs_to]
    }
    delete formattedComment.belongs_to;
    delete formattedComment.created_by;
    return formattedComment;
 }) 
 return formattedComments;
}



