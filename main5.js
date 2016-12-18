new Promise(resolve => {
    if (document.readyState == 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then(function() {
    return new Promise((resolve, reject)=> {
        VK.init({ apiId: 5760615});

        VK.Auth.login(response => {
            if (response.session) {
                resolve(response);
            } else {
                reject(new Error('Ошибка авторизации'));
            }
        }, 2)
    });
}).then(function() {
    return new Promise((resolve, reject) =>{

        if (sessionStorage.getItem('allFriends')) {
            let allFriendsObj = JSON.parse(sessionStorage.getItem('allFriends')); //массив всех друзей
            resolve(allFriendsObj);
        }
        VK.api('friends.get', {
            'fields': 'photo_50'
        }, serverAnswer => {
            if (serverAnswer.error) {
                console.log('error');
                reject(new Error('error'));
            } else {
                let allFriendsObj = serverAnswer.response; //массив всех друзей
                resolve(allFriendsObj);
            }
        });
    })
}).then(allFriendsObj => {

    let selectFriendsObj = []; //массив выбранных друзей
    let allFriendsList = document.getElementById('allFriends'); // контейнер для вывода всех друзей
    let selectFriendsList = document.getElementById('selectFriends'); // контейнер для вывода выбранных друзей
    let source = friendTemplate.innerHTML;
    let templateFn = Handlebars.compile(source);

    // =============== Вывод всех друзей ==================
    let template = templateFn({
        list: allFriendsObj
    });
    allFriendsList.innerHTML += template;

    // =============== Вывод выбранных друзей (если они сохранены) ==================
    if (sessionStorage.getItem('selectFriends')) {
        selectFriendsObj = JSON.parse(sessionStorage.getItem('selectFriends'));
        let template = templateFn({
            list: selectFriendsObj
        });
        selectFriendsList.innerHTML += template;
    }


    // =============== Поиск ==================
    document.addEventListener('input', check); //обработчик input

    function check(e) {
        if (!e.target.tagName == 'INPUT') {
            return false;
        }

        if (e.target.dataset.list === 'allFriends') {
            searchIn(allFriendsList, allFriendsObj, e.target.value);
        } else if (e.target.dataset.list === 'selectFriends') {
            searchIn(selectFriendsList, selectFriendsObj, e.target.value);
        }
    }

    // =============== Поиск ==================
    function searchIn(list, obj, input) {
        for (let i = 0; i < list.children.length; ++i) {
            list.children[i].style.display = 'none';
        }
        for (let item of obj) {
            if (!input == "" & findPartial(item.first_name, item.last_name, input)) {
                document.getElementById(item.uid).style.display = "block";
            } else if (input == "") {
                document.getElementById(item.uid).style.display = "block";
            }
        }
    }

    function findPartial(firstname, lastname, search) {
        if (firstname.toLowerCase().indexOf(search.toLowerCase().trim()) >= 0 || lastname.toLowerCase().indexOf(search.toLowerCase().trim()) >= 0 || firstname.concat(' ', lastname).toLowerCase().indexOf(search.toLowerCase().trim()) >= 0 || lastname.concat(' ', firstname).toLowerCase().indexOf(search.toLowerCase().trim()) >= 0) {
            //  firstname.concat(' ', lastname).toLowerCase().indexOf(search.toLowerCase().trim())
            return true;
        }
        return false;
    }

    //drag&drop события
    allFriends.addEventListener('dragstart', handleDragStart, false);
    selectFriends.addEventListener('dragenter', handleDragEnter, false)
    selectFriends.addEventListener('dragover', handleDragOver, false);
    selectFriends.addEventListener('dragleave', handleDragLeave, false);
    selectFriends.addEventListener('drop', handleDrop, false);

    function handleDragStart(e) {
        if (e.target.tagName == "LI") {
            e.target.style.backgroundColor = '#ccc';
            e.dataTransfer.effectAllowed = 'move'
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
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

    function handleDrop(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        var data = e.dataTransfer.getData("text");
        document.getElementById(data).style.backgroundColor = '#fff';
        addToObj(data, selectFriendsObj);
        deleteFromObj(data, allFriendsObj);
        selectFriends.appendChild(document.getElementById(data));
        document.getElementById(data).setAttribute('draggable', false);
        e.stopPropagation();
        return false;
    }



// добавление друга в массив
    function addToObj(data, obj) {

        var friend = {};
        friend.uid = document.getElementById(data).id
        friend.first_name = document.getElementById(data).dataset.firstname;
        friend.last_name = document.getElementById(data).dataset.lastname;
        friend.photo_50 = document.getElementById(data).dataset.photo;
        obj.push(friend);
    }
// удаление друга в массив
    function deleteFromObj(data, obj) {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i].uid == data) {
                obj.splice(i, 1);
            }
        }
    }
// обработка событий на элементах '+', 'Х', и 'сохранить''
    document.addEventListener('click', habdleClick);

    function habdleClick(e) {
        var e = e.target;
        if (e.className == 'add') {
            var data = e.closest('li').getAttribute('id');
            addToObj(data, selectFriendsObj);
            deleteFromObj(data, allFriendsObj);
            selectFriendsList.appendChild(document.getElementById(data));
            document.getElementById(data).setAttribute('draggable', false);
        } else if (e.className == 'delete') {
            var data = e.closest('li').getAttribute('id');
            deleteFromObj(data, selectFriendsObj)
            addToObj(data, allFriendsObj);
            allFriendsList.appendChild(document.getElementById(data));
            document.getElementById(data).setAttribute('draggable', true);
        } else if (e.tagName == 'BUTTON') {
            sessionStorage.setItem("allFriends", JSON.stringify(allFriendsObj));
            sessionStorage.setItem("selectFriends", JSON.stringify(selectFriendsObj));
        }
    }
});