var Order = AV.Object.extend('Order');
var OrderCustomerMap = AV.Object.extend('OrderCustomerMap');

function releaseNewOrder() {

  var technicianId = $('#inputTechnician').val();
  var serviceType = $('#inputService').val();
  var amount = $('#inputAmount').val();
  var paymentType = $('#inputPaymentType').val();
  var customerFrom = $('#inputFrom').val();
  var assigned = $('#inputAssigned').val();

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
  if (isCurrentUser()) {
    $(".new-order").on('submit', function(e) {
      e.preventDefault();
      releaseNewOrder();
    });
  } else {
    window.location.href = "./../login/login.html";
  }
});
