Object.keys(app.modules).forEach((key) => {
  app.modules[key].load();
});
