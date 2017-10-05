// handlebars context
var context = {
  technicians: []
};

function setupData() {
  // LeanCloud - 查询
  // https://leancloud.cn/docs/leanstorage_guide-js.html#查询
  var query = new AV.Query('Technician');
  // query.include('owner');
  // query.include('image');
  query.descending('createdAt');
  query.find().then(function (technicians) {
    technicians.forEach(function(technician) {
      console.log(JSON.stringify(technician));
      var name = technician.get('name');
      var id = technician.get('objectId');
      var releaseTime = (technician.createdAt.getMonth() + 1) + '/' + technician.createdAt.getDate() + '/' +  technician.createdAt.getFullYear();
      // var ownerUsername = technician.get('owner').get('username');
      // var productImage = technician.get('image');
      // var productImageUrl;
      // if (productImage) {
      //   productImageUrl = productImage.get('url');
      // } else {
      //   productImageUrl = './../storage.png'
      // }
      // handlebars context
      context.technicians.push({
        id,
        name,
        releaseTime
      });
    });

    // use handlebars to update html
    var source = $("#technicians-list").html();
    var template = Handlebars.compile(source);
    var html = template(context);
    $('.technicians-detail').html(html);

  }).catch(function(error) {
    alert(JSON.stringify(error));
  });
};

function newTechnician() {
  window.location.href = "./../new-technician/new-technician.html";
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
