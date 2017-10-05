// 拉取技师列表
// handlebars context
var context = {
  technicians: []
};

function setupData() {
  // LeanCloud - 查询
  // https://leancloud.cn/docs/leanstorage_guide-js.html#查询
  var query = new AV.Query('Technician');
  query.descending('createdAt');
  query.find().then(function (technicians) {
    technicians.forEach(function(technician) {
      console.log(JSON.stringify(technician));
      var name = technician.get('name');
      var objectId = technician.get('objectId');
      var releaseTime = technician.createdAt.getFullYear() + '/' + (technician.createdAt.getMonth() + 1) + '/' + technician.createdAt.getDate();
      // var ownerUsername = order.get('owner').get('username');
      // var productImage = order.get('image');
      // var productImageUrl;
      // if (productImage) {
      //   productImageUrl = productImage.get('url');
      // } else {
      //   productImageUrl = './../storage.png'
      // }
      // handlebars context
      context.technicians.push({
        name,
        objectId,
        releaseTime
      });
    });

    // use handlebars to update html
    var source = $("#technicians-list").html();
    var template = Handlebars.compile(source);
    var html = template(context);
    $('.technician-detail').html(html);

  }).catch(function(error) {
    alert(JSON.stringify(error));
  });
};

//创建订单
var Order = AV.Object.extend('Order');
var OrderCustomerMap = AV.Object.extend('OrderCustomerMap');

function releaseNewOrder() {

  var technicianId = $('#inputTechnician').val();
  var serviceType = $('#inputService').val();
  var amount = $('#inputAmount').val();
  var paymentType = $('#inputPaymentType').val();
  var customerFrom = $('#inputFrom').val();
  var assigned = $('#inputAssigned').val();

  console.log('technicianId : ' + technicianId)

  return;
  var query = new AV.Query('Technician');
  query.get(technicianId).then(function (technician) {
    if (technician == null) {
      alert("未找到该技师。")
    }

    // LeanCloud - 当前用户
    // https://leancloud.cn/docs/leanstorage_guide-js.html#当前用户
    var currentUser = AV.User.current();

    // LeanCloud - 文件
    // https://leancloud.cn/docs/leanstorage_guide-js.html#文件
    // var file = $('#inputFile')[0].files[0];
    // var name = file.name;
    // var avFile = new AV.File(name, file);

    var order = new Order();
    order.set('serviceType', serviceType);
    order.set('amount', amount);
    order.set('paymentType', paymentType);
    order.set('customerFrom', customerFrom);
    order.set('assigned', assigned);
    order.set('technician', technician);
    // order.set('customerType', description);
    // order.set('gender', description);
    // order.set('source', description);
    // order.set('assigned', description);
    // order.set('vipCardId', vipCardId);

    var orderCustomerMap = new OrderCustomerMap();
    orderCustomerMap.set('order', order);
    orderCustomerMap.set('technician', technician);

    orderCustomerMap.save().then(function() {
      window.location.href = "./../orders-list/orders-list.html";
    }, function(error) {
      alert(JSON.stringify(error));
    });
  }, function (error) {
    // 异常处理
    console.log(error);
    alert("未找到该技师。")
  });

};

$(function() {
  setupData();
  if (isCurrentUser()) {
    $(".new-order").on('submit', function(e) {
      e.preventDefault();
      releaseNewOrder();
    });
  } else {
    window.location.href = "./../login/login.html";
  }
});
