// handlebars context
var context = {
  orders: []
};

function setupData() {
  // LeanCloud - 查询
  // https://leancloud.cn/docs/leanstorage_guide-js.html#查询
  var query = new AV.Query('Order');
  // query.include('owner');
  // query.include('image');
  query.include('amount');
  query.include('paymentType');
  query.descending('createdAt');
  query.find().then(function (orders) {
    orders.forEach(function(order) {
      console.log(JSON.stringify(order));
      var amount = order.get('amount');
      var paymentType = order.get('paymentType');
      var releaseTime = (order.createdAt.getMonth() + 1) + '/' + order.createdAt.getDate() + '/' +  order.createdAt.getFullYear();
      // var ownerUsername = order.get('owner').get('username');
      // var productImage = order.get('image');
      // var productImageUrl;
      // if (productImage) {
      //   productImageUrl = productImage.get('url');
      // } else {
      //   productImageUrl = './../storage.png'
      // }
      // handlebars context
      context.orders.push({
        amount,
        paymentType,
        releaseTime
      });
    });

    // use handlebars to update html
    var source = $("#orders-list").html();
    var template = Handlebars.compile(source);
    var html = template(context);
    $('.orders-detail').html(html);

  }).catch(function(error) {
    alert(JSON.stringify(error));
  });
};

function logout() {
  AV.User.logOut();
  window.location.href = "./../login/login.html";
};

$(function() {
  if (isCurrentUser()) {
    setupData();
  } else {
    window.location.href = "./../login/login.html";
  }
});
