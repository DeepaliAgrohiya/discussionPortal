let leftBody = document.getElementById('leftBody');
let submitBtn = document.getElementById('submitBtn');
let container = document.getElementById('container');
let subInput = document.getElementById('subInput');
let rightQuesInput = document.getElementById('rightQuesInput');
let responseName = document.getElementById('responseName');
let comment = document.getElementById('comment');
let responseSubmitBtn = document.getElementById('responseSubmitBtn');
let rightTemplate = document.getElementById('rightTemplate');
let firstRight = document.getElementById('firstRight');
let secondRight = document.getElementById('secondRight');
let leftBodyTemplate = document.getElementById('leftBodyTemplate');
let responseBlock = document.getElementById('responseBlock');

let existingData = JSON.parse(localStorage.getItem("questionsBlock")) || {};

let favouriteCount = Math.max(...Object.values(existingData).map(q => q.favourite || 0), 0);

let buttons = document.getElementById('buttons');
let upwardCount = document.getElementById('upwardCount')
let downwardCount = document.getElementById('downwardCount');

let thumbup = document.getElementById('thumbup');
let thumbdown = document.getElementById('thumbdown');
let star = document.getElementById('star');
// let p = document.getElementById('noResponseYet');

let cloneResponseName = document.getElementById('cloneResponseName');
let cloneComment = document.getElementById('cloneComment');

let clickedDiv;

let responseContainer = document.getElementById('response');
let responseID = null;
let clonedDiv;

let count = localStorage.getItem('lastID') ? parseInt(localStorage.getItem('lastID')) : 1;


document.addEventListener("DOMContentLoaded", loadExistingQuestions);

container.addEventListener('click', (e) => {

    console.log(e.target.id);

    if (e.target.id === 'subInput') {
        if (!subInput.dataset.listenerAdded) {
            subInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    if (subInput.value.trim() === "") {
                        alert("Subject field is required!");
                    } else {
                        rightQuesInput.focus();
                    }
                }
            });
            subInput.dataset.listenerAdded = "true";
        }
    }

    if (e.target.id == 'submitBtn') { 
        if (subInput.value.trim() === "" || rightQuesInput.value.trim() === "") {
            alert("Both Subject and Question fields are required!");
            return;
        }

        let templateDiv = document.getElementById('leftBodyTemplate');
        let newEntryDiv = templateDiv.cloneNode(true);
        newEntryDiv.style.display = "block"; 
        newEntryDiv.id = count; 

        let leftp1 = newEntryDiv.querySelector(".subject");
        let leftp2 = newEntryDiv.querySelector(".question");

        leftp1.innerText = subInput.value;
        leftp2.innerText = rightQuesInput.value;

        leftBody.appendChild(newEntryDiv);

        createLocalStorage(subInput.value, rightQuesInput.value);

        subInput.value = "";
        rightQuesInput.value = "";
    }

    if(e.target.id =='quesForm'){
        firstRight.style.display = 'block';
        secondRight.style.display = 'none';
    }

    let clickedDiv = e.target.closest(".height");   
    if (clickedDiv && leftBody.contains(clickedDiv)) {

        responseID = clickedDiv.id;
        console.log(responseID);
        clonedDiv = clickedDiv.cloneNode(true);
        clonedDiv.id = "cloned" + clickedDiv.id; 
        rightTemplate.innerHTML = ""; 
        rightTemplate.appendChild(clonedDiv);
        firstRight.style.display ='none';
        secondRight.style.display = 'block';

        let clonedHeadingFav = clonedDiv.querySelector("#headingFav");
        if (clonedHeadingFav) {
            clonedHeadingFav.style.display = "none";
        }
        let cloneStar = clonedDiv.querySelector("#star");
        if(cloneStar){
            cloneStar.style.display = "none"; 
        }

        loadResponses(responseID);
    }

    if (e.target.id === 'responseName') {
        if (!responseName.dataset.listenerAdded) {
            responseName.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    if (responseName.value.trim() === "") {
                        alert("Name field is required!");
                    } else {
                        comment.focus();
                    }
                }
            });
            responseName.dataset.listenerAdded = "true";
        }
    }

    if (e.target.id === 'responseSubmitBtn') {
        if (responseName.value.trim() === "" || comment.value.trim() === "") {
            alert("Both Name and Comment fields are required!");
            return;
        }

        if (responseID && existingData[responseID]) {
            
            console.log(responseID);
            let responseCount = Object.keys(existingData[responseID].responses).length + 0;
            let responseKey = responseCount;
        
            existingData[responseID].responses[responseKey] = {
                name: responseName.value,
                comment: comment.value,
                upwardCount: 0,  
                downwardCount: 0 
            };

            localStorage.setItem("questionsBlock", JSON.stringify(existingData));
        
            let clonehonewalaresponse = responseContainer;
            let newResponse = clonehonewalaresponse.cloneNode(true);
            newResponse.style.display = "block";
            newResponse.id = responseKey;
            console.log(newResponse.id);
            let responsep1 = newResponse.querySelector("#cloneResponseName");
            let responsep2 = newResponse.querySelector("#cloneComment");
            responsep1.innerText = responseName.value;
            responsep2.innerText = comment.value;
            responseBlock.appendChild(newResponse);
            
            console.log(responsep1.innerText);
            console.log(responsep2.innerText);

            responseName.value = "";
            comment.value = "";
            
        }
    }
    
    if (e.target.id === 'resolveBtn') {
        //this is something new for me //
        let clickedDiv = document.getElementById(responseID);
        console.log(responseID);
        console.log(clickedDiv);
        let questionID = responseID;
    
        document.getElementById("firstRight").style.display = "block";
        document.getElementById("secondRight").style.display = "none";
    
        if (existingData[questionID]) {
            delete existingData[questionID]; 
        }
    
        if (clickedDiv) {
            clickedDiv.remove();
        }
    
        localStorage.setItem("questionsBlock", JSON.stringify(existingData));
    }
    
    if (e.target.id === "star") {
        
         let clickedDiv = e.target.closest(".height");
        if (!clickedDiv) return;

        let questionID = clickedDiv.id;

        if (existingData[questionID]) {
            if (existingData[questionID].favourite === 0) {
                favouriteCount++;
                existingData[questionID].favourite = favouriteCount;
            } else {
                existingData[questionID].favourite = 0;
            }
            
            localStorage.setItem("questionsBlock", JSON.stringify(existingData));
        }
        e.target.classList.toggle("star-highlight", existingData[questionID].favourite !== 0);

        sortQuestionsByFavCount();
    }
    
    if (e.target.id === 'thumbup' || e.target.closest("#thumbup")) { 
        if (!responseID) return; 
    
        let clickedResponseDiv = e.target.closest(".clone"); 
        if (!clickedResponseDiv) return; 
    
        let responseKey = clickedResponseDiv.id; 
    
        if (existingData[responseID].responses[responseKey]) {
            
            existingData[responseID].responses[responseKey].upwardCount = 
                (existingData[responseID].responses[responseKey].upwardCount || 0) + 1;
    
            localStorage.setItem("questionsBlock", JSON.stringify(existingData));
    
            let countSpan = clickedResponseDiv.querySelector("#upwardCount");
            if (countSpan) {
                countSpan.innerText = existingData[responseID].responses[responseKey].upwardCount;
            }
            console.log(existingData[responseID].responses[responseKey].upwardCount);
            sortingVotes(responseID);
            // uiVotes(responseID);
            renderResponse(responseID);
        }
    }
    
    if (e.target.id === 'thumbdown' || e.target.closest("#thumbdown")) { 
        if (!responseID) return; 
    
        let clickedResponseDiv = e.target.closest(".clone"); 
        if (!clickedResponseDiv) return; 
    
        let responseKey = clickedResponseDiv.id;
    
        if (existingData[responseID].responses[responseKey]) {
            
            existingData[responseID].responses[responseKey].downwardCount = 
                    (existingData[responseID].responses[responseKey].downwardCount || 0) - 0;
        
            console.log("Before update:", existingData[responseID].responses[responseKey].downwardCount);
        
            existingData[responseID].responses[responseKey].downwardCount -= 1;
        
            console.log("After update:", existingData[responseID].responses[responseKey].downwardCount);
        
  
            localStorage.setItem("questionsBlock", JSON.stringify(existingData));
        
            let countSpan = clickedResponseDiv.querySelector("#downwardCount");
            if (countSpan) {
                countSpan.innerText = Math.abs(existingData[responseID].responses[responseKey].downwardCount);
            }
        }        
        sortingVotes(responseID);
        renderResponse(responseID);
    }    
    
});

function loadResponses(questionID) {
        responseBlock.innerHTML = ""; 
        let responseDiv = document.getElementById("response");
        
    
        Object.entries(existingData[questionID].responses).forEach(([key, response]) => {
            let newResponse = responseDiv.cloneNode(true);
            newResponse.style.display = "block";  
            newResponse.id = key;  
    
            let responsep1 = newResponse.querySelector("#cloneResponseName");
            let responsep2 = newResponse.querySelector("#cloneComment");
            let upvoteSpan = newResponse.querySelector("#upwardCount");
            let downvoteSpan = newResponse.querySelector("#downwardCount");
            
            responsep1.innerText = response.name; 
            responsep2.innerText = response.comment; 
    
            if (upvoteSpan) {
                upvoteSpan.innerText = response.upwardCount || 0;
            }
            if (downvoteSpan) {
                downvoteSpan.innerText = response.downwardCount || 0;
            }
            
            responseBlock.appendChild(newResponse);  
        });
    }
   
function createLocalStorage(d1, d2) {

    let timestamp = Date.now(); // Store creation time
    let newEntry = {
        ID: count,
        subject: d1,
        question: d2,
        responses : {},
        favourite: 0,
        creationTime: timestamp 
    };

    existingData[count] = newEntry;
    localStorage.setItem('questionsBlock', JSON.stringify(existingData));

    console.log("Saved Data:", existingData);

    count++;
    localStorage.setItem('lastID', count);
}

function loadExistingQuestions() {
    Object.values(existingData).forEach(entry => {
        let templateDiv = document.getElementById('leftBodyTemplate');
        let newEntryDiv = templateDiv.cloneNode(true);
        newEntryDiv.style.display = "block"; 
        newEntryDiv.id = entry.ID; 

        let leftp1 = newEntryDiv.querySelector(".subject");
        let leftp2 = newEntryDiv.querySelector(".question");
        let star = newEntryDiv.querySelector("#star");
        let timeSpan = newEntryDiv.querySelector(".creation-time");

          if (entry.favourite === 1) {
            star.classList.add("star-highlight");
        } else {
            star.classList.remove("star-highlight");
        }

        leftp1.innerText = entry.subject;
        leftp2.innerText = entry.question;
        timeSpan.innerText = getTimeAgo(entry.creationTime); 

        leftBody.appendChild(newEntryDiv);
        
        sortQuestionsByFavCount();
    });
    setInterval(updateCreationTimes, 60000);
}

document.getElementById('searchInput').addEventListener('input', () => {
    let searchValue = document.getElementById('searchInput').value.trim().toLowerCase();
    
    let filteredData = Object.values(existingData).filter(entry =>
        entry.subject.toLowerCase().includes(searchValue)
    );

    leftBody.innerHTML = ""; 

    if (filteredData.length === 0) {
        let noMatchDiv = document.createElement("div");
        noMatchDiv.innerText = "No match found";
        noMatchDiv.style.textAlign = "center";
        noMatchDiv.style.color = "red";
        noMatchDiv.style.fontSize = "2rem";
        noMatchDiv.style.paddingTop = "10px";
        leftBody.appendChild(noMatchDiv);
    } else {
        filteredData.forEach(entry => {
            let newEntryDiv = leftBodyTemplate.cloneNode(true);
            newEntryDiv.style.display = "block";
            newEntryDiv.id = entry.ID;

            let leftp1 = newEntryDiv.querySelector(".subject");
            let leftp2 = newEntryDiv.querySelector(".question");
            let star = newEntryDiv.querySelector("#star"); 

            let subjectText = entry.subject;
            let highlightedSubject = subjectText.replace(
                new RegExp(`(${searchValue})`, 'gi'), 
                '<span class="highlight">$1</span>' 
            );

            leftp1.innerHTML = highlightedSubject;
            leftp2.innerText = entry.question;
            
            if (star) {
                if (entry.favourite > 0 ) {
                    star.classList.add("star-highlight");
                } else {
                    star.classList.remove("star-highlight");
                }
            }

            leftBody.appendChild(newEntryDiv);
            sortQuestionsByFavCount();
            updateCreationTimes();
        });
    }
    
}); 


function sortQuestionsByFavCount() {
    console.log("Sorting favorites...");

    let sortedEntries = Object.entries(existingData);

    sortedEntries.sort((a, b) => {
        let favA = a[1].favourite || 0;
        let favB = b[1].favourite || 0;

        // Sorting logic:
        // 1. If one is a favorite and the other is not, keep favorites first
        if (favA === 0 && favB > 0) return 1;  // Move non-favorites down
        if (favA > 0 && favB === 0) return -1; // Move favorites up

        // 2. Among favorites, sort by fav count in ascending order
        if (favA > 0 && favB > 0) return favA - favB;

        // 3. Among non-favorites, sort by original order (ID)
        return a[0] - b[0];
    });

    existingData = Object.fromEntries(sortedEntries);

    localStorage.setItem("questionsBlock", JSON.stringify(existingData));

    updateUI(sortedEntries);
}

function updateUI(sortedEntries) {
    let leftBody = document.getElementById("leftBody");

    sortedEntries.forEach(([id, entry]) => {
        let questionDiv = document.getElementById(id);
        if (questionDiv) {
            let star = questionDiv.querySelector("#star");

            // Restore star highlight class based on favourite status
            if (entry.favourite > 0) {
                star.classList.add("star-highlight");
            } else {
                star.classList.remove("star-highlight");
            }

            leftBody.appendChild(questionDiv);
        }
    });
}

//************************// sorting votes 

function sortingVotes(questionID) {
    let responsesArray = existingData[questionID].responses;

    let resArray = Object.values(responsesArray);

    resArray.sort((a, b) => (b.upwardCount + b.downwardCount) - (a.upwardCount + a.downwardCount));
    
    for(let key in resArray){
        existingData[questionID].responses[key] = resArray[key];
    }
    console.log(existingData[questionID].responses);

    console.log(resArray);
    localStorage.setItem("questionsBlock", JSON.stringify(existingData));
}

function renderResponse(responseID) {
    responseBlock.innerHTML = "";

    let responses = Object.entries(existingData[responseID].responses);
    console.log(responses);

    responses.forEach((response) => {
        console.log(response);
        console.log(response[1].upwardCount);

        let clonehonewalaresponse = responseContainer;
        let newResponse = clonehonewalaresponse.cloneNode(true);
        newResponse.style.display = "block";
        newResponse.id = response[0];
        console.log(newResponse.id);

        let responsep1 = newResponse.querySelector("#cloneResponseName");
        let responsep2 = newResponse.querySelector("#cloneComment");
        let upwardCountSpan = newResponse.querySelector("#upwardCount");  
        let downwardCountSpan = newResponse.querySelector("#downwardCount");  

        responsep1.innerText = response[1].name;
        responsep2.innerText = response[1].comment;

        if (upwardCountSpan) {
            upwardCountSpan.innerText = response[1].upwardCount;  
        }

        if (downwardCountSpan) {
            downwardCountSpan.innerText = response[1].downwardCount;  
        }

        responseBlock.appendChild(newResponse);
    });
}
// creation timing ***********************************//

function getTimeAgo(timestamp) {
    let now = Date.now();
    let diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    let diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    let diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour ago`;
    let diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day ago`;
}

function updateCreationTimes() {
    document.querySelectorAll(".height").forEach(entryDiv => {
        let entryID = entryDiv.id;
        let timeSpan = entryDiv.querySelector(".creation-time");

        if (existingData[entryID]) {
            let formattedTime = getTimeAgo(existingData[entryID].creationTime);
            timeSpan.innerText = formattedTime;
        }
    });
}