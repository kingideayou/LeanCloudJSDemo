// 拉取技师列表
// handlebars context
var context = {
  technicians: []
};

//添加技师
var Technician = AV.Object.extend('Technician');

function addTechnician() {

  var name = $('#inputName').val();
  var gender = $('#inputGender').val();
  var jobTitle = $('#inputJobTitle').val();

  var query = new AV.Query('Technician');
  query.equalTo('name', name);
  query.find().then(function (technicians) {
    // console.log(JSON.stringfy(technicians))
    if(technicians && technicians.length){
      alert("该技师已注册。")
      return;
    }

    var technician = new Technician();
    technician.set('name', name);
    technician.set('gender', gender);
    technician.set('jobTitle', jobTitle);

    technician.save().then(function() {
      window.location.href = "./../technicians-list/technicians-list.html";
    }, function(error) {
      alert(JSON.stringify(error));
    });
  }, function (error) {
    // 异常处理
    console.log(error);
    alert("未找到该技师。");
  });

};


$(function() {
  if (isCurrentUser()) {
    $(".new-technician").on('submit', function(e) {
      e.preventDefault();
      addTechnician();
    });
  } else {
    window.location.href = "./../login/login.html";
  }
});
