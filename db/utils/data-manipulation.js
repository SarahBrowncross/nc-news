exports.formatTime = (articles) => {
  const formattedArticles = articles.map((article) => {
    const newDate = new Date(article.created_at);
    const formattedArticle = { ...article, created_at: newDate };
    return formattedArticle;
  });
  return formattedArticles;
};

exports.makeRefObj = () => {};
