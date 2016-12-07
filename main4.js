new Promise(function(resolve){
    if (document.readyState =='complete'){
        resolve();
   } else {
        window.onload = resolve;
    }
}).then(function(){
    return new Promise(function(resolve, reject){
        VK.init({apiId: 5760615});

        VK.Auth.login(function(response){
            if (response.session){
                resolve(response);
            } else{
                reject(new Error('Ошибка авторизации'));
            }
        }, 2)
    });
}).then(function(){
   return new Promise(function(resolve, reject){
    VK.api('friends.get', {'fields':'photo_50'}, function(serverAnswer){
        if (serverAnswer.error){
            console.log('error');
            reject(new Error('error'));
        } else{
       let allFriendsObj = serverAnswer.response; 

        resolve(allFriendsObj);
        }
    });
   })
}).then(function(allFriendsObj){

var selectFriendsObj= [];
var allFriendsList = document.getElementById('allFriends');
var selectFriendsList = document.getElementById('selectFriends');

      for (var item of allFriendsObj){

       addFriend(item, allFriendsList);
    }

document.addEventListener('input', check); //обработчик input

     function check(e){
      if (!e.target.tagName=='INPUT'){return false;}
        
     
         if (e.target.dataset.list === 'allFriends'){
                searchIn(allFriendsList, allFriendsObj, e.target.value);
              }  
            else if (e.target.dataset.list === 'selectFriends'){
                searchIn(selectFriendsList, selectFriendsObj, e.target.value);
                
            }  

     }
function searchIn(list, obj, input){
    console.log(list, obj, input);
     list.innerHTML ='';
     
     for (var item of obj){
        if (!input=="" & findPartial(item.first_name, item.last_name, input)){
            addFriend(item, list);
        }
        else if (input==""){
            addFriend(item, list);
        }
    }
}

  function addFriend(item, list){
        var source = friendTemplate.innerHTML;
        var templateFn = Handlebars.compile(source);
        var template = templateFn(item); 
        list.innerHTML += template;

  }
// Поиск 
    function findPartial(firstname, lastname, search) {
    if (firstname.toLowerCase().indexOf(search.toLowerCase()) >= 0 || lastname.toLowerCase().indexOf(search.toLowerCase()) >= 0){
        return true;
     }
    return false;
    }



allFriends.addEventListener('dragstart', handleDragStart, false);
selectFriends.addEventListener('dragenter', handleDragEnter, false)
selectFriends.addEventListener('dragover', handleDragOver, false);
selectFriends.addEventListener('dragleave', handleDragLeave, false);
selectFriends.addEventListener('drop', handleDrop, false);



 function handleDragStart(e) {
   if (e.target.tagName == "LI"){
     e.target.style.backgroundColor = '#ccc';
     e.dataTransfer.effectAllowed='move'
     e.dataTransfer.setData('text', e.target.id);
        console.log('drag');
     return true;

   }
 }


 function handleDragEnter(e) {
  e.target.classList.add('over');
}
 function handleDragLeave(e) {
  e.target.classList.remove('over');
}


function handleDragOver(e) {
  if (e.preventDefault) {e.preventDefault();}
        return false;
}

function handleDrop(e) {
      if (e.preventDefault) {e.preventDefault();}

    var data = e.dataTransfer.getData("text");
     document.getElementById(data).style.backgroundColor = '#fff';
    addToObj(data, selectFriendsObj);
   deleteFromObj(data, allFriendsObj);
   e.target.appendChild(document.getElementById(data));

   console.log(selectFriendsObj);

   

    e.stopPropagation();
    return false;
}


function addToObj(data, obj){
    selectFriendItem = selectFriends.querySelectorAll('.friend__item');
    console.log(selectFriendItem);
   if (selectFriendItem.length == 0){
      var i = 0;
   } else{
     i = selectFriendItem.length;
   }
    obj[i]={};
    obj[i].uid =document.getElementById(data).id
    obj[i].first_name = document.getElementById(data).dataset.firstname;
    obj[i].last_name = document.getElementById(data).dataset.lastname;
    obj[i].photo_50 = document.getElementById(data).dataset.photo;
 

}

function deleteFromObj(data, obj){
   for( let i=0; i < obj.length; i++){
    if (obj[i].uid == data){
      obj.splice(i, 1);
    }
   }
}

document.addEventListener('click', habdleClick);

function habdleClick(e){
  var e=e.target;
  if(e.className =='add'){
   var data = e.closest('li').getAttribute('id');

   addToObj(data, selectFriendsObj);
   selectFriendsList.appendChild(document.getElementById(data));
  } else if(   e.className == 'delete'){
   var data = e.closest('li').getAttribute('id');
   deleteFromObj(data, selectFriendsObj)
   addToObj(data, allFriendsObj);
   allFriendsList.appendChild(document.getElementById(data));
  }

}

  });
