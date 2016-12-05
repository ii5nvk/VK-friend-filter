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
        var allFriendsObj = serverAnswer.response; 
 
        var source = friendTemplate.innerHTML;
        var templateFn = Handlebars.compile(source);
        
        for (var item of allFriendsObj){
           var template = templateFn(item); 
           allFriends.innerHTML += template;
        }
   
        resolve(allFriendsObj);
        }
    });
   })
}).then(function(allFriendsObj){

var selectFriendsObj= {};

document.addEventListener('input', check); //обработчик input

     function check(e){
      if (!e.target.tagName=='INPUT'){return false;}
        
     
         if (e.target.dataset.list === 'allFriends'){
                searchIn(e.target.dataset.list, allFriendsObj, e.target.value);
              }  
            else if (e.target.dataset.list === 'selectFriends'){
                searchIn(e.target.dataset.list, selectFriendsObj, e.target.value);
                
            }  

     }
function searchIn(list, obj, input){
    console.log(list, obj, input);
     document.getElementById(list).innerHTML ='';
     
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
        document.getElementById(list).innerHTML += template;
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
   e.target.appendChild(document.getElementById(data));
   SelectObj();
   

    e.stopPropagation();
    return false;
}
function SelectObj(){
    selectFriendItem = selectFriends.querySelectorAll('.friend__item');

    for (let i = 0; i < selectFriendItem.length; i++){
selectFriendsObj[i]={};
     selectFriendsObj[i].uid =selectFriendItem[i].id
    selectFriendsObj[i].firstname = selectFriendItem[i].dataset.firstname;
    selectFriendsObj[i].lastname = selectFriendItem[i].dataset.lastname;
    selectFriendsObj[i].photo = selectFriendItem[i].dataset.photo;
    }

}

});


