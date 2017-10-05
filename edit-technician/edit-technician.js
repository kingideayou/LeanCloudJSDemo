// handlebars context
var context = {
  // technicians: []
  name: "",
  amountCount: 0,
  releaseTime: ""
};

function setupData() {

  let url = new URL(window.location);
  let searchParams = new URLSearchParams(url.search);
  var userId = searchParams.get('user');

  if (userId == null || userId.length == 0) {
    alert('请填写技师 ID');
    return;
  }

  // var mTechnician = AV.Object.createWithoutData('Technician', userId);

  // LeanCloud - 查询
  // https://leancloud.cn/docs/leanstorage_guide-js.html#查询
  var query = new AV.Query('Technician');
  query.descending('createdAt');
  query.get(userId).then(function (technician) {

    if (technician == null) {
      alert("未找到该技师");
      return;
    }

    var orderQuery = new AV.Query('Order');
    // 想在查询的同时获取关联对象的属性则一定要使用 `include` 接口用来指定返回的 `key`
    orderQuery.include('technician');
    orderQuery.equalTo('technician', technician);
    orderQuery.find().then(function (orders) {

    // console.log(JSON.stringify(orders));
    var amountCount = 0;
    orders.forEach(function(order) {
      amountCount += parseInt(order.get('amount'));
    });
    console.log('amountCount : ' + amountCount);

    var name = technician.get('name');
    var releaseTime = technician.createdAt.getFullYear() + '/' +  (technician.createdAt.getMonth() + 1) + '/' + technician.createdAt.getDate();

    context.name = name;
    context.amountCount = amountCount;
    context.releaseTime = releaseTime;

    console.log(context)

    // use handlebars to update html
    var source = $("#technicians-list").html();
    var template = Handlebars.compile(source);
    var html = template(context);
    $('.technicians-detail').html(html);

    }).catch(function(error) {
      alert(JSON.stringify(error));
    });


  }).catch(function(error) {
    alert("查找失败：" + JSON.stringify(error));
  });
};

function showTechnicianList() {
  window.location.href = "./../technicians-list/technicians-list.html";
}

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
