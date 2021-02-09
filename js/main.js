const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

// create element and render cafe
function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let kill = document.createElement('div');
    // doc.id is the auto-generated id firestore created for my documents
    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    kill.textContent = 'Delete';
    // console.log(db)
    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(kill);

    cafeList.appendChild(li);

    // DELETING DATA
    kill.addEventListener('click', (e) => {
        e.stopPropagation();
        // im getting a id variable and setting it to (e/event.target[aka kill]), then im getting the parent element of that kill(aka li), finally im getting the id of that element(data.id)
        // let id = e.target.parentElement.getAttribute('data-id');

        //  since the doc variable is in scope when the delete handler is bound then there is no reason to use a DOM attribute to store the document id. Line 25 could read "let id = doc.id". Just a thought.     
        // let id = doc.id;
        let id = e.target.parentElement.getAttribute('data-id');
        // delete cammand
        db.collection('cafes').doc(id).delete();
    });
}


// GETTING DATA

// the db.collection()is asynchronous(return a promise)so i tac on .then to run a function(snapshot) after it has been loaded(callback function)
// db.collection('cafes').orderBy('time', 'desc').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     })
// });


// SAVING DATA
form.addEventListener('submit', (e) => {
    // to prevent the defaut of submit(reload page) 
    e.preventDefault()
    db.collection('cafes').add({
        // grabing the html form and then grabing the input value
        name: form.name.value,
        city: form.city.value.toLowerCase(),
        time: new Date().getTime()
    })
        .then(() => { form.reset(); console.log("Cafe Added") })
        .catch(err => alert("uhh, something went wrong.", err))

    // clearing the input field once button is clicked
    form.name.value = '';
    form.city.value = '';
});

// REAL-TIME LISTENER
// real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if (change.type == 'added') {
            renderCafe(change.doc);
        } else if (change.type == 'removed') {
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    });
});