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
  
var allFriendsList = document.getElementById('allFriends');
var selectFriendsList = document.getElementById('selectFriends');
let source = friendTemplate.innerHTML;
let templateFn = Handlebars.compile(source);

 if (sessionStorage.getItem('allFriends')){

  allFriendsObj = JSON.parse(sessionStorage.getItem('allFriends'));}
  console.log(allFriendsObj);

   let template = templateFn({list:allFriendsObj}); 
   allFriendsList.innerHTML += template;




if (!sessionStorage.getItem('selectFriends') ){
  var selectFriendsObj= [];
} else{

  selectFriendsObj = JSON.parse(sessionStorage.getItem('selectFriends'));

    
        let template = templateFn({list:selectFriendsObj}); 
        selectFriendsList.innerHTML += template;


/*    for (var item of selectFriendsObj){
       addFriend(item, selectFriendsList);
    }*/
}

      /*  let source = document.getElementById('playerItemTemplate').innerHTML;
        let templateFn = Handlebars.compile(source);
        let template = templateFn({list: response.response});

        results.innerHTML = template;*/



  

    function addFriend(item, list){
        var source = friendTemplate.innerHTML;
        var templateFn = Handlebars.compile(source);
        var template = templateFn(item); 
        list.innerHTML += template;

  }

// поиск
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


    function findPartial(firstname, lastname, search) {
    if (firstname.toLowerCase().indexOf(search.toLowerCase()) >= 0 || lastname.toLowerCase().indexOf(search.toLowerCase()) >= 0){
        return true;
     }
    return false;
    }


//drag&drop
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
    document.getElementById(data).setAttribute('draggable', false);
    e.stopPropagation();
    return false;
}

//
function addToObj(data, obj){

  var  friend={};
       friend.uid =document.getElementById(data).id
       friend.first_name = document.getElementById(data).dataset.firstname;
       friend.last_name = document.getElementById(data).dataset.lastname;
       friend.photo_50 = document.getElementById(data).dataset.photo;
       obj.push(friend);
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
   deleteFromObj(data, allFriendsObj);
   selectFriendsList.appendChild(document.getElementById(data));
   document.getElementById(data).setAttribute('draggable', false);
  } else if(   e.className == 'delete'){
   var data = e.closest('li').getAttribute('id');
   deleteFromObj(data, selectFriendsObj)
   addToObj(data, allFriendsObj);
   allFriendsList.appendChild(document.getElementById(data));
    document.getElementById(data).setAttribute('draggable', true);
  } else if (e.tagName=='BUTTON'){
    sessionStorage.setItem("allFriends", JSON.stringify(allFriendsObj));
    sessionStorage.setItem("selectFriends", JSON.stringify(selectFriendsObj));
  }
}
  });
