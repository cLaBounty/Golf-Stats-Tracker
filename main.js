function switchToSignup() {
    // clear error and input
    document.getElementById('login-error-message').style.visibility = "hidden";
    document.getElementById('login-email-input').value = "";
    document.getElementById('login-password-input').value = "";

    // switch forms
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function switchToLogin() {
    // clear error and input
    document.getElementById('signup-error-message').style.visibility = "hidden";
    document.getElementById('signup-email-input').value = "";
    document.getElementById('signup-password-input').value = "";
    document.getElementById('signup-displayName-input').value = "";

    // switch forms
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function login() {
    const email = document.getElementById('login-email-input').value;
    const password = document.getElementById('login-password-input').value;

    // check if user exists
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        toHomePage();
    }).catch(err => {
        document.getElementById('login-error-message').innerHTML = err.message;
        document.getElementById('login-error-message').style.visibility = 'visible';
    });
}

function signup() {
    const email = document.getElementById('signup-email-input').value;
    const password = document.getElementById('signup-password-input').value;
    let displayName = document.getElementById('signup-displayName-input').value;

    // if no display name, then set to email
    if (displayName == "") {
        displayName = email;
    }

    // create new user 
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        database.collection('userData').doc(cred.user.uid).set({
            onePutts: 0,
            currentOnePutts: 0,
            twoPutts: 0,
            currentTwoPutts: 0,
            threePuttsPLUS: 0,
            currentThreePuttsPLUS: 0,
            birdiesMINUS: 0,
            currentBirdiesMINUS: 0,
            pars: 0,
            currentPars: 0,
            bogeys: 0,
            currentBogeys: 0,
            doubleBogeysPLUS: 0,
            currentDoubleBogeysPLUS: 0,
            holesWithHazard: 0,
            currentHolesWithHazard: 0,
            fairwaysInReg: 0,
            currentFairwaysInReg: 0,
            greensInReg: 0,
            currentGreensInReg: 0,
            totalHolesPlayed_scores: 0,
            totalHolesPlayed_putts: 0,
            totalHolesPlayed_greensInReg: 0,
            totalHolesPlayed_fairwaysInReg: 0,
            totalHolesPlayed_holesWithHazard: 0,
            currentTotalHolesPlayed: 0,

            trackScores: true,
            shareBirdiesMINUS: true,
            sharePars: true,
            shareBogeys: true,
            shareDoubleBogeysPLUS: true,

            trackPutts: true,
            shareOnePutts: true,
            shareTwoPutts: true,
            shareThreePuttsPLUS: true,

            trackHolesWithHazard: true,
            shareHolesWithHazard: true,

            trackFairwaysInReg: true,
            shareFairwaysInReg: true,

            trackGreensInReg: true,
            shareGreensInReg: true,

            friends: []
        });
        database.collection('users').doc(cred.user.uid).set({
            displayName: displayName,
            uid: cred.user.uid
        });
        toHomePage();
    }).catch(err => { // if there is an error, then display message
        document.getElementById('signup-error-message').innerHTML = err.message;
        document.getElementById('signup-error-message').style.visibility = 'visible';
    });
}

function logout() {
    auth.signOut().then(() => {
        location.reload();
    });
}

// sleep for given amount of time
const sleep = (seconds) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

// remove all pages
function hidePages() {
    document.getElementById('nav-check').checked = false;

    document.getElementById('home-page').style.display = 'none';
    document.getElementById('friends-page').style.display = 'none';
    document.getElementById('settings-page').style.display = 'none';
    document.getElementById('newRound-page').style.display = 'none';
    document.getElementById('stats-page').style.display = 'none';
}

function toHomePage() {
    // only home page needs to "hide" the login page 
    document.getElementById('login-page').style.display = 'none';

    hidePages();

    // display new stuff
    document.getElementById('navbar').style.display = 'block';
    document.getElementById('home-page').style.display = 'flex';
    document.getElementById('page-label').innerHTML = "Home";

    // reset new round page
    document.getElementById("hole-number-text").style.display = 'flex';
    document.getElementById("newRound-error-full").style.display = 'none';
    document.getElementById("nine-hole-message").style.display = 'none';
    document.getElementById("round-end-message").style.display = 'none';
    document.getElementById('hole-number').innerHTML = 1;
}

// ****************************************************************************************************************************** \\

function toFriendsPage() {
    friendPageSetUp();

    hidePages();

    // display new stuff
    document.getElementById('friends-page').style.display = 'flex';
    document.getElementById('page-label').innerHTML = "Friends";
}

// live friend search
$(document).ready(function () {
    $("#displayName-input").keyup(function () {
        const input = String($(this).val());
        var count = 0;

        if (input != "") {
            // looping through the list
            $(".userlist-div").each(function () {
                // if they don't math
                if ($(this).text().search(new RegExp(input, "i")) < 0) {
                    $(this).fadeOut(600);
                }
                else { // if they do match
                    $(this).css('display', 'grid')
                    $(this).fadeIn(600);
                    count++;
                }
            });
            // if 0 results, display message
            if (count == 0) {
                $("#no-results-message-value").text("\"" + input + "\"");
                document.getElementById('no-results-message').style.display = 'block';
            }
            else {
                document.getElementById('no-results-message').style.display = 'none';
            }
        }
        else { // if empty
            document.getElementById('no-results-message').style.display = 'none';
            $(".userlist-div").each(function () {
                $(this).fadeOut(600);
            });
        }
    });
});

var friendPageSetUp = (function () {
    var executed = false;
    return function () {
        if (!executed) {
            executed = true;

            database.collection('users').get().then(snapshot => {
                // getting all users displayName and uid and adding div
                snapshot.docs.forEach(doc => {
                    // not add current user
                    if (auth.currentUser.uid != doc.data().uid) {
                        addUser(doc.data().displayName, doc.data().uid);
                    }
                });
            });

            // getting current users info
            const currentUserId = auth.currentUser.uid;
            database.collection('userData').doc(currentUserId).get().then(snapshot => {
                const currentUser = snapshot.data();

                let myArray = currentUser.friends;

                // check for friends and setting + to -
                for (let i in myArray) {
                    var target, targetID;
                    database.collection('users').doc(myArray[i]).get().then(snapshot => {
                        const user = snapshot.data();
                        target = user.displayName;
                        targetID = user.uid;

                        $(".userlist-div").each(function () {
                            if ($(this).text() == target) {
                                document.getElementById(targetID + '-add').style.display = 'none';
                                document.getElementById(targetID + '-remove').style.display = 'block';
                            }
                        });
                    });
                }
            });
        }
    };
})();

function addUser(displayName, uid) {
    const ul = document.getElementById("user-list");

    var div = document.createElement("div");
    var userIcon = document.createElement("i");
    var li = document.createElement("li");
    var plusIconDiv = document.createElement("div");
    var plusIcon = document.createElement("i");
    var minusIconDiv = document.createElement("div");
    var minusIcon = document.createElement("i");

    div.setAttribute('class', 'userlist-div');
    li.setAttribute('class', 'userlist-li');
    userIcon.setAttribute('class', 'fas fa-user');
    plusIcon.setAttribute('class', 'fas fa-plus');
    minusIcon.setAttribute('class', 'fas fa-minus');

    plusIconDiv.onclick = function () { addFriend(uid); }
    minusIconDiv.onclick = function () { removeFriend(uid); }

    plusIconDiv.setAttribute('id', uid + '-add');
    minusIconDiv.setAttribute('id', uid + '-remove');
    plusIconDiv.setAttribute('class', 'userlist-plus');
    minusIconDiv.setAttribute('class', 'userlist-minus');

    li.appendChild(document.createTextNode(displayName));

    plusIconDiv.appendChild(plusIcon);
    minusIconDiv.appendChild(minusIcon);

    div.appendChild(userIcon);
    div.appendChild(li);
    div.appendChild(plusIconDiv);
    div.appendChild(minusIconDiv);

    ul.appendChild(div);
}

function addFriend(uid) {
    document.getElementById(uid + '-add').style.display = 'none';
    document.getElementById(uid + '-remove').style.display = 'block';

    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('userData').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        // copying array
        let myArray = currentUser.friends;

        // adding uid to array
        myArray.push(uid);

        // updating array in firebase
        database.collection('userData').doc(currentUserId).update({
            friends: myArray
        });
    });
}

function removeFriend(uid) {
    document.getElementById(uid + '-remove').style.display = 'none';
    document.getElementById(uid + '-add').style.display = 'block';

    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('userData').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        // copying array
        let myArray = currentUser.friends;

        // removing from array
        const index = myArray.indexOf(uid);
        if (index > -1) {
            myArray.splice(index, 1);
        }

        // updating array in firebase
        database.collection('userData').doc(currentUserId).update({
            friends: myArray
        });
    });
}

// ****************************************************************************************************************************** \\

function toSettingsPage() {
    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('users').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();
        document.getElementById('displayName-setting-input').value = currentUser.displayName;
    });
    database.collection('userData').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        hidePages();

        // display new stuff
        document.getElementById('settings-page').style.display = 'block';
        document.getElementById('page-label').innerHTML = "Settings";

        // setting values to data from firebase
        document.getElementById('trackScores-toggle').checked = currentUser.trackScores;
        document.getElementById('shareBirdiesMINUS-toggle').checked = currentUser.shareBirdiesMINUS;
        document.getElementById('sharePars-toggle').checked = currentUser.sharePars;
        document.getElementById('shareBogeys-toggle').checked = currentUser.shareBogeys;
        document.getElementById('shareDoubleBogeysPLUS-toggle').checked = currentUser.shareDoubleBogeysPLUS;
        document.getElementById('trackPutts-toggle').checked = currentUser.trackPutts;
        document.getElementById('shareOnePutts-toggle').checked = currentUser.shareOnePutts;
        document.getElementById('shareTwoPutts-toggle').checked = currentUser.shareTwoPutts;
        document.getElementById('shareThreePuttsPLUS-toggle').checked = currentUser.shareThreePuttsPLUS;
        document.getElementById('trackHolesWithHazard-toggle').checked = currentUser.trackHolesWithHazard;
        document.getElementById('shareHolesWithHazard-toggle').checked = currentUser.shareHolesWithHazard;
        document.getElementById('trackFairwaysInReg-toggle').checked = currentUser.trackFairwaysInReg;
        document.getElementById('shareFairwaysInReg-toggle').checked = currentUser.shareFairwaysInReg;
        document.getElementById('trackGreensInReg-toggle').checked = currentUser.trackGreensInReg;
        document.getElementById('shareGreensInReg-toggle').checked = currentUser.shareGreensInReg;

        // check if share labels or buttons should be changed
        checkTrackScores();
        checkTrackPutts();
        checkTrackFairwaysInReg();
        checkTrackGreensInReg();
        checkTrackHolesWithHazard();
    });
}

// update user settings in firebase
function saveSettings() {
    const currentUserId = auth.currentUser.uid;

    // if user leaves setting blank, then don't change it
    const newDisplayName = document.getElementById('displayName-setting-input').value;
    if (newDisplayName != "") {
        database.collection('users').doc(currentUserId).update({
            displayName: newDisplayName
        });
    }

    database.collection('userData').doc(currentUserId).update({
        trackScores: document.getElementById('trackScores-toggle').checked,
        shareBirdiesMINUS: document.getElementById('shareBirdiesMINUS-toggle').checked,
        sharePars: document.getElementById('sharePars-toggle').checked,
        shareBogeys: document.getElementById('shareBogeys-toggle').checked,
        shareDoubleBogeysPLUS: document.getElementById('shareDoubleBogeysPLUS-toggle').checked,
        trackPutts: document.getElementById('trackPutts-toggle').checked,
        shareOnePutts: document.getElementById('shareOnePutts-toggle').checked,
        shareTwoPutts: document.getElementById('shareTwoPutts-toggle').checked,
        shareThreePuttsPLUS: document.getElementById('shareThreePuttsPLUS-toggle').checked,
        trackHolesWithHazard: document.getElementById('trackHolesWithHazard-toggle').checked,
        shareHolesWithHazard: document.getElementById('shareHolesWithHazard-toggle').checked,
        trackFairwaysInReg: document.getElementById('trackFairwaysInReg-toggle').checked,
        shareFairwaysInReg: document.getElementById('shareFairwaysInReg-toggle').checked,
        trackGreensInReg: document.getElementById('trackGreensInReg-toggle').checked,
        shareGreensInReg: document.getElementById('shareGreensInReg-toggle').checked,
    });
    toHomePage();
}

// checking track settings -> if tracking is of, then turn off sharing
function checkTrackScores() {
    const labelElements = document.getElementsByClassName('score-setting-label');
    if (!document.getElementById('trackScores-toggle').checked) {
        const toggleElements = document.getElementsByClassName('score-setting-toggle');

        // setting all share score settings to false
        for (let i = 0; i < toggleElements.length; i++) {
            toggleElements[i].checked = false;
        }

        // setting all share score settings labels to gray and line through
        for (let i = 0; i < labelElements.length; i++) {
            labelElements[i].style.color = 'rgb(225, 225, 225)'
            labelElements[i].style.textDecoration = 'line-through';
        }
    }
    else {
        // setting all share score settings labels to original style
        for (let i = 0; i < labelElements.length; i++) {
            labelElements[i].style.color = 'rgb(255, 255, 255)'
            labelElements[i].style.textDecoration = 'none';
        }
    }
}
function checkTrackPutts() {
    const labelElements = document.getElementsByClassName('putt-setting-label');
    if (!document.getElementById('trackPutts-toggle').checked) {
        const toggleElements = document.getElementsByClassName('putt-setting-toggle');

        // setting all share putt settings to false
        for (let i = 0; i < toggleElements.length; i++) {
            toggleElements[i].checked = false;
        }

        // setting all share putt settings labels to gray and line through
        for (let i = 0; i < labelElements.length; i++) {
            labelElements[i].style.color = 'rgb(225, 225, 225)'
            labelElements[i].style.textDecoration = 'line-through';
        }
    }
    else {
        // setting all share putt settings labels to original style
        for (let i = 0; i < labelElements.length; i++) {
            labelElements[i].style.color = 'rgb(255, 255, 255)'
            labelElements[i].style.textDecoration = 'none';
        }
    }
}
function checkTrackFairwaysInReg() {
    const labelElement = document.getElementById('shareFairwaysInReg-label');
    if (!document.getElementById('trackFairwaysInReg-toggle').checked) {
        const toggleElement = document.getElementById('shareFairwaysInReg-toggle');
        toggleElement.checked = false;

        labelElement.style.color = 'rgb(225, 225, 225)'
        labelElement.style.textDecoration = 'line-through';
    }
    else {
        labelElement.style.color = 'rgb(255, 255, 255)'
        labelElement.style.textDecoration = 'none';
    }
}
function checkTrackGreensInReg() {
    const labelElement = document.getElementById('shareGreensinReg-label');
    if (!document.getElementById('trackGreensInReg-toggle').checked) {
        const toggleElement = document.getElementById('shareGreensInReg-toggle');
        toggleElement.checked = false;

        labelElement.style.color = 'rgb(225, 225, 225)'
        labelElement.style.textDecoration = 'line-through';
    }
    else {
        labelElement.style.color = 'rgb(255, 255, 255)'
        labelElement.style.textDecoration = 'none';
    }
}
function checkTrackHolesWithHazard() {
    const labelElement = document.getElementById('shareHolesWithHazard-label');
    if (!document.getElementById('trackHolesWithHazard-toggle').checked) {
        const toggleElement = document.getElementById('shareHolesWithHazard-toggle');
        toggleElement.checked = false;

        labelElement.style.color = 'rgb(225, 225, 225)'
        labelElement.style.textDecoration = 'line-through';
    }
    else {
        labelElement.style.color = 'rgb(255, 255, 255)'
        labelElement.style.textDecoration = 'none';
    }
}

// ****************************************************************************************************************************** \\

function toNewRoundPage() {
    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('userData').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        // hide home-page - (only accessible from home page)
        document.getElementById('home-page').style.display = 'none';

        // fixes issue of going to newRound page and then changing settings
        document.getElementById('Q1').style.display = 'none';
        document.getElementById('Q2').style.display = 'none';
        document.getElementById('Q3').style.display = 'none';
        document.getElementById('Q4').style.display = 'none';
        document.getElementById('Q5').style.display = 'none';

        // display new stuff
        document.getElementById('newRound-page').style.display = 'flex';
        document.getElementById('page-label').innerHTML = "New Round";

        // reset all current values
        database.collection('userData').doc(currentUserId).update({
            currentOnePutts: 0,
            currentTwoPutts: 0,
            currentThreePuttsPLUS: 0,
            currentBirdiesMINUS: 0,
            currentPars: 0,
            currentBogeys: 0,
            currentDoubleBogeysPLUS: 0,
            currentHolesWithHazard: 0,
            currentFairwaysInReg: 0,
            currentGreensInReg: 0,
            currentTotalHolesPlayed: 0
        });

        // display first question
        if (currentUser.trackScores) {
            document.getElementById('Q1').style.display = 'flex';
        }
        else if (currentUser.trackPutts) {
            document.getElementById('Q2').style.display = 'flex';
        }
        else if (currentUser.trackFairwaysInReg) {
            document.getElementById('Q3').style.display = 'flex';
        }
        else if (currentUser.trackGreensInReg) {
            document.getElementById('Q4').style.display = 'flex';
        }
        else if (currentUser.trackHolesWithHazard) {
            document.getElementById('Q5').style.display = 'flex';
        }
        else { // not tracking anything
            document.getElementById("hole-number-text").style.display = 'none';
            document.getElementById("newRound-error-full").style.display = 'flex';
            document.getElementById("newRound-error").innerHTML = 'It looks like you are not tracking any stats. Update your settings to start a new round.'
            sleep(4).then(() => {
                document.getElementById("newRound-error-full").style.display = 'none';
                toSettingsPage();
            })
        }
    });
}

function nextQuestion(prevQuestion) {
    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('userData').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        // getting last question
        var lastQuestion;
        if (currentUser.trackHolesWithHazard) {
            lastQuestion = 5;
        }
        else if (currentUser.trackGreensInReg) {
            lastQuestion = 4;
        }
        else if (currentUser.trackFairwaysInReg) {
            lastQuestion = 3;
        }
        else if (currentUser.trackPutts) {
            lastQuestion = 2;
        }
        else {
            lastQuestion = 1;
        }

        // if previous question is not the last, then go to next
        if (lastQuestion != prevQuestion) {
            if (prevQuestion == 1) {
                document.getElementById('Q1').style.display = 'none';

                if (currentUser.trackPutts) {
                    document.getElementById('Q2').style.display = 'flex';
                }
                else if (currentUser.trackFairwaysInReg) {
                    document.getElementById('Q3').style.display = 'flex';
                }
                else if (currentUser.trackGreensInReg) {
                    document.getElementById('Q4').style.display = 'flex';
                }
                else if (currentUser.trackHolesWithHazard) {
                    document.getElementById('Q5').style.display = 'flex';
                }

                // increase total holes played with tracking scores
                database.collection('userData').doc(currentUserId).update({
                    totalHolesPlayed_scores: currentUser.totalHolesPlayed_scores + 1
                });
            }
            else if (prevQuestion == 2) {
                document.getElementById('Q2').style.display = 'none';

                if (currentUser.trackFairwaysInReg) {
                    document.getElementById('Q3').style.display = 'flex';
                }
                else if (currentUser.trackGreensInReg) {
                    document.getElementById('Q4').style.display = 'flex';
                }
                else if (currentUser.trackHolesWithHazard) {
                    document.getElementById('Q5').style.display = 'flex';
                }

                // increase total holes played with tracking putts
                database.collection('userData').doc(currentUserId).update({
                    totalHolesPlayed_putts: currentUser.totalHolesPlayed_putts + 1
                });
            }
            else if (prevQuestion == 3) {
                document.getElementById('Q3').style.display = 'none';

                if (currentUser.trackGreensInReg) {
                    document.getElementById('Q4').style.display = 'flex';
                }
                else if (currentUser.trackHolesWithHazard) {
                    document.getElementById('Q5').style.display = 'flex';
                }

                // increase total holes played with tracking scores
                database.collection('userData').doc(currentUserId).update({
                    totalHolesPlayed_fairwaysInReg: currentUser.totalHolesPlayed_fairwaysInReg + 1
                });
            }
            else if (prevQuestion == 4) {
                document.getElementById('Q4').style.display = 'none';

                if (currentUser.trackHolesWithHazard) {
                    document.getElementById('Q5').style.display = 'flex';
                }

                // increase total holes played with tracking greens in regulation
                database.collection('userData').doc(currentUserId).update({
                    totalHolesPlayed_greensInReg: currentUser.totalHolesPlayed_greensInReg + 1
                });
            }
        }
        else { // if it is the last question
            const holeNum = document.getElementById('hole-number').innerHTML;

            // hiding last question
            switch (lastQuestion) {
                case 5:
                    document.getElementById('Q5').style.display = 'none';
                    // increase total holes played with tracking holes with hazards
                    database.collection('userData').doc(currentUserId).update({
                        totalHolesPlayed_holesWithHazard: currentUser.totalHolesPlayed_holesWithHazard + 1
                    });
                    break;
                case 4:
                    document.getElementById('Q4').style.display = 'none';
                    // increase total holes played with tracking greens in regulation
                    database.collection('userData').doc(currentUserId).update({
                        totalHolesPlayed_greensInReg: currentUser.totalHolesPlayed_greensInReg + 1
                    });
                    break;
                case 3:
                    document.getElementById('Q3').style.display = 'none';
                    // increase total holes played with tracking scores
                    database.collection('userData').doc(currentUserId).update({
                        totalHolesPlayed_fairwaysInReg: currentUser.totalHolesPlayed_fairwaysInReg + 1
                    });
                    break;
                case 2:
                    document.getElementById('Q2').style.display = 'none';
                    // increase total holes played with tracking putts
                    database.collection('userData').doc(currentUserId).update({
                        totalHolesPlayed_putts: currentUser.totalHolesPlayed_putts + 1
                    });
                    break;
                case 1:
                    // increase total holes played with tracking scores
                    database.collection('userData').doc(currentUserId).update({
                        totalHolesPlayed_scores: currentUser.totalHolesPlayed_scores + 1
                    });
            }

            // display messages at 9 and 18 holes, instead of going to next hole
            if (holeNum == 9) {
                document.getElementById('hole-number-text').style.display = 'none';
                document.getElementById('nine-hole-message').style.display = 'flex';
            }
            else if (holeNum == 18) {
                document.getElementById('hole-number-text').style.display = 'none';
                document.getElementById('round-end-message').style.display = 'flex';
            }
            else {
                // going back to first question
                if (currentUser.trackScores) {
                    document.getElementById('Q1').style.display = 'flex';
                }
                else if (currentUser.trackPutts) {
                    document.getElementById('Q2').style.display = 'flex';
                }
                else if (currentUser.trackFairwaysInReg) {
                    document.getElementById('Q3').style.display = 'flex';
                }
                else if (currentUser.trackGreensInReg) {
                    document.getElementById('Q4').style.display = 'flex';
                }
                else if (currentUser.trackHolesWithHazard) {
                    document.getElementById('Q5').style.display = 'flex';
                }
            }

            // increasing hole # by 1
            document.getElementById('hole-number').innerHTML++;

            database.collection('userData').doc(currentUserId).update({
                currentTotalHolesPlayed: currentUser.currentTotalHolesPlayed + 1
            });
        }
    });
}

function makeTheTurn() {
    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('userData').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        document.getElementById('nine-hole-message').style.display = 'none';
        document.getElementById('hole-number-text').style.display = 'flex';

        // going back to first question
        if (currentUser.trackScores) {
            document.getElementById('Q1').style.display = 'flex';
        }
        else if (currentUser.trackPutts) {
            document.getElementById('Q2').style.display = 'flex';
        }
        else if (currentUser.trackFairwaysInReg) {
            document.getElementById('Q3').style.display = 'flex';
        }
        else if (currentUser.trackGreensInReg) {
            document.getElementById('Q4').style.display = 'flex';
        }
        else if (currentUser.trackHolesWithHazard) {
            document.getElementById('Q5').style.display = 'flex';
        }
    });
}

function finishRound() {
    document.getElementById('nine-hole-message').style.display = 'none';
    document.getElementById('round-end-message').style.display = 'flex';
}

function submitScore() {
    // get values from input
    const parOptions = document.getElementsByName('par-option');
    const scoreOptions = document.getElementsByName('score-option');
    var parValue = null;
    var scoreValue = null;
    for (var i = 0; i < parOptions.length; i++) {
        if (parOptions[i].checked) {
            parValue = parseInt(parOptions[i].value);
            parOptions[i].checked = false;
            break;
        }
    }
    for (var i = 0; i < scoreOptions.length; i++) {
        if (scoreOptions[i].checked) {
            scoreValue = parseInt(scoreOptions[i].value);
            scoreOptions[i].checked = false;
            break;
        }
    }

    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('userData').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        if (parValue != null && scoreValue != null) {
            // update to new values
            if (scoreValue < parValue) { // birdie or less
                database.collection('userData').doc(currentUserId).update({
                    birdiesMINUS: currentUser.birdiesMINUS + 1,
                    currentBirdiesMINUS: currentUser.currentBirdiesMINUS + 1
                });
            }
            else if (scoreValue == parValue) { // par
                database.collection('userData').doc(currentUserId).update({
                    pars: currentUser.pars + 1,
                    currentPars: currentUser.currentPars + 1
                });
            }
            else if (scoreValue == (parValue + 1)) { // bogey
                database.collection('userData').doc(currentUserId).update({
                    bogeys: currentUser.bogeys + 1,
                    currentBogeys: currentUser.currentBogeys + 1
                });
            }
            else { // double bogey or more
                database.collection('userData').doc(currentUserId).update({
                    doubleBogeysPLUS: currentUser.doubleBogeysPLUS + 1,
                    currentDoubleBogeysPLUS: currentUser.currentDoubleBogeysPLUS + 1
                });
            }
        }
    });

    if (parValue != null && scoreValue != null) {
        nextQuestion(1);
    }
    else { // display error message
        document.getElementById("hole-number-text").style.display = 'none';
        document.getElementById("Q1").style.display = 'none';
        document.getElementById("newRound-error-full").style.display = 'flex';
        document.getElementById("newRound-error").innerHTML = 'You must enter a par and score for this hole before moving on.';
        sleep(3).then(() => {
            document.getElementById("newRound-error-full").style.display = 'none';
            document.getElementById("Q1").style.display = 'flex';
            document.getElementById("hole-number-text").style.display = 'flex';
        })
    }
}

function submitPutts(puttsNum) {
    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('userData').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        // update to new values
        if (puttsNum == 1) {
            database.collection('userData').doc(currentUserId).update({
                onePutts: currentUser.onePutts + 1,
                currentOnePutts: currentUser.currentOnePutts + 1
            });
        }
        else if (puttsNum == 2) {
            database.collection('userData').doc(currentUserId).update({
                twoPutts: currentUser.twoPutts + 1,
                currentTwoPutts: currentUser.currentTwoPutts + 1
            });
        }
        else { // 3+
            database.collection('userData').doc(currentUserId).update({
                threePuttsPLUS: currentUser.threePuttsPLUS + 1,
                currentThreePuttsPLUS: currentUser.currentThreePuttsPLUS + 1
            });
        }
    });

    nextQuestion(2);
}

function questionYes(questionNum) {
    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('userData').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        // update to new values
        if (questionNum == 3) { // fairways in regulation
            database.collection('userData').doc(currentUserId).update({
                fairwaysInReg: currentUser.fairwaysInReg + 1,
                currentFairwaysInReg: currentUser.currentFairwaysInReg + 1
            });
        }
        else if (questionNum == 4) { // greens in regulation
            database.collection('userData').doc(currentUserId).update({
                greensInReg: currentUser.greensInReg + 1,
                currentGreensInReg: currentUser.currentGreensInReg + 1
            });
        }
        else { // hazards
            database.collection('userData').doc(currentUserId).update({
                holesWithHazard: currentUser.holesWithHazard + 1,
                currentHolesWithHazard: currentUser.currentHolesWithHazard + 1
            });
        }
    });

    nextQuestion(questionNum);
}

// ****************************************************************************************************************************** \\

function toStatsPage() {
    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('userData').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        // only accessible from home page
        document.getElementById('home-page').style.display = 'none';

        hidePages();

        // display container
        document.getElementById("stats-container").style.display = 'block';

        // only show stats that are being tracked
        checkStatTracking('scores-stat-btn', currentUser.trackScores);
        checkStatTracking('putts-stat-btn', currentUser.trackPutts);
        checkStatTracking('greensInReg-stat-btn', currentUser.trackGreensInReg);
        checkStatTracking('fairwaysInReg-stat-btn', currentUser.trackFairwaysInReg);
        checkStatTracking('holesWithHazards-stat-btn', currentUser.trackHolesWithHazard);

        // display new stuff
        document.getElementById('stats-page').style.display = 'flex';
        document.getElementById('page-label').innerHTML = "Stats";

        // load first stat
        var firstStat;
        if (currentUser.trackScores) {
            firstStat = 'pars';
        }
        else if (currentUser.trackPutts) {
            firstStat = 'twoPutts';
        }
        else if (currentUser.trackFairwaysInReg) {
            firstStat = 'fairwaysinReg';
        }
        else if (currentUser.trackGreensInReg) {
            firstStat = 'greensinReg';
        }
        else if (currentUser.trackHolesWithHazard) {
            firstStat = 'holesWithHazards';
        }
        else { // not tracking anything
            document.getElementById("stats-container").style.display = 'none';
            document.getElementById("track-error-full").style.display = 'flex';
            document.getElementById("track-error").innerHTML = 'It looks like you are not tracking any stats. Update your settings to track your stats.'
            sleep(4).then(() => {
                document.getElementById("track-error-full").style.display = 'none';
                toSettingsPage();
            });
        }

        changePercentCircle('current', firstStat);
        changePercentCircle('lifetime', firstStat);
        loadFriendsTab();
    });
}

function checkStatTracking(elementsName, condition) {
    const elements = document.getElementsByClassName(elementsName);
    for (let i = 0; i < elements.length; i++) {
        if (!condition) {
            elements[i].style.display = 'none';
        }
        else {
            elements[i].style.display = 'block';
        }
    }
}

function newStatsTab(pageName, element) {
    // hide all drop downs
    document.getElementById("curScore-dropdown-content").classList.remove("show");
    document.getElementById("curPutt-dropdown-content").classList.remove("show");
    document.getElementById("score-dropdown-content").classList.remove("show");
    document.getElementById("putt-dropdown-content").classList.remove("show");

    // hide all tab content
    const statsContents = document.getElementsByClassName('stats-content');
    for (let i = 0; i < statsContents.length; i++) {
        statsContents[i].style.display = 'none';
    }

    // reseting text and background color of all tabs
    const statsTabs = document.getElementsByClassName('stats-tab');
    for (let i = 0; i < statsTabs.length; i++) {
        statsTabs[i].style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        statsTabs[i].style.color = '#ffffff';
    }

    // displaying new tab
    document.getElementById(pageName).style.display = 'flex';

    // setting tab to active color
    element.style.backgroundColor = '#ffffff';
    element.style.color = '#000000';
}

function showCurrentScoreStatsOptions() {
    // show/hide all drop downs
    document.getElementById("curPutt-dropdown-content").classList.remove("show");
    document.getElementById("curScore-dropdown-content").classList.toggle("show");
}

function showCurrentPuttStatsOptions() {
    // show/hide all drop downs
    document.getElementById("curScore-dropdown-content").classList.remove("show");
    document.getElementById("curPutt-dropdown-content").classList.toggle("show");
}

function showScoreStatsOptions() {
    // show/hide all drop downs
    document.getElementById("putt-dropdown-content").classList.remove("show");
    document.getElementById("score-dropdown-content").classList.toggle("show");
}

function showPuttStatsOptions() {
    // show/hide all drop downs
    document.getElementById("score-dropdown-content").classList.remove("show");
    document.getElementById("putt-dropdown-content").classList.toggle("show");
}

function changePercentCircle(tab, stat) {
    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('userData').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        if (tab == 'current') {
            // hide drop downs
            document.getElementById("curScore-dropdown-content").classList.remove("show");
            document.getElementById("curPutt-dropdown-content").classList.remove("show");

            // reset to counting color
            document.getElementById('currentPercentageWheel-text').style.color = 'rgb(150, 150, 150)';

            var statName, numerator, percentage;

            if (stat == 'birdies') {
                statName = "Birdies or lower";
                numerator = currentUser.currentBirdiesMINUS;
            }
            else if (stat == 'pars') {
                statName = "Pars";
                numerator = currentUser.currentPars;
            }
            else if (stat == 'bogeys') {
                statName = "Bogeys";
                numerator = currentUser.currentBogeys;
            }
            else if (stat == 'doubleBogeys') {
                statName = "Double Bogeys or higher";
                numerator = currentUser.currentDoubleBogeysPLUS;
            }
            else if (stat == 'onePutts') {
                statName = "1 Putts";
                numerator = currentUser.currentOnePutts;
            }
            else if (stat == 'twoPutts') {
                statName = "2 Putts";
                numerator = currentUser.currentTwoPutts;
            }
            else if (stat == 'threePutts') {
                statName = "3 Putts or more";
                numerator = currentUser.currentThreePuttsPLUS;
            }
            else if (stat == 'greensinReg') {
                statName = "Greens in Regulation";
                numerator = currentUser.currentGreensInReg;
            }
            else if (stat == 'fairwaysinReg') {
                statName = "Fairways in Regulation";
                numerator = currentUser.currentFairwaysInReg;
            }
            else if (stat == 'holesWithHazards') {
                statName = "Holes with Hazards";
                numerator = currentUser.currentHolesWithHazard;
            }

            // setting percentage
            percentage = numerator / currentUser.currentTotalHolesPlayed;

            const finalStatNum = (percentage * 100).toFixed(2);
            document.getElementById('currentPercentageWheel-text').innerHTML = String(numerator + ' / ' + currentUser.currentTotalHolesPlayed);

            // setting size of wheel to 70% of div height
            const divHeight = $(".percentageWheel").height();
            $('#currentPercentageWheel').attr('data-size', (0.70 * divHeight));

            // setting stat name to new value
            document.getElementById("current-stat-name").innerHTML = statName;

            // hiding numbers
            document.getElementById('currentPercentageWheel-text').style.visibility = 'hidden';

            // wheel animation
            if (!isNaN(percentage)) {
                $("#currentPercentageWheel").circleProgress({ fill: { color: '#3b8ad9' }, value: percentage })
                    .on('circle-animation-progress', function (event, progress, stepValue) {
                        document.getElementById('currentPercentageWheel-percent').innerHTML = String(stepValue.toFixed(5).substr(2, 2) + '.' + stepValue.toFixed(5).substr(4, 2) + '%');
                    }).on('circle-animation-end', function () {
                        document.getElementById('currentPercentageWheel-percent').innerHTML = String(finalStatNum + '%');
                        document.getElementById('currentPercentageWheel-percent').style.color = '#ffffff';
                        document.getElementById('currentPercentageWheel-text').style.display = 'block';
                        document.getElementById('currentPercentageWheel-text').style.visibility = 'visible';
                    });
            }
            else {
                $("#currentPercentageWheel").circleProgress({ value: 0 }).on('circle-animation-end', function () {
                    document.getElementById('currentPercentageWheel-text').style.display = 'none';
                    document.getElementById('currentPercentageWheel-percent').innerHTML = String('N/A');
                });
            }
        }
        else if (tab == 'lifetime') {
            // hide drop downs
            document.getElementById("score-dropdown-content").classList.remove("show");
            document.getElementById("putt-dropdown-content").classList.remove("show");

            // reset to counting color
            document.getElementById('lifetimePercentageWheel-text').style.color = 'rgb(150, 150, 150)';

            var statName, numerator, denominator, percentage;

            if (stat == 'birdies') {
                statName = "Birdies or lower";
                numerator = currentUser.birdiesMINUS;
                denominator = currentUser.totalHolesPlayed_scores;
            }
            else if (stat == 'pars') {
                statName = "Pars";
                numerator = currentUser.pars;
                denominator = currentUser.totalHolesPlayed_scores;
            }
            else if (stat == 'bogeys') {
                statName = "Bogeys";
                numerator = currentUser.bogeys;
                denominator = currentUser.totalHolesPlayed_scores;
            }
            else if (stat == 'doubleBogeys') {
                statName = "Double Bogeys or higher";
                numerator = currentUser.doubleBogeysPLUS;
                denominator = currentUser.totalHolesPlayed_scores;
            }
            else if (stat == 'onePutts') {
                statName = "1 Putts";
                numerator = currentUser.onePutts;
                denominator = currentUser.totalHolesPlayed_putts;
            }
            else if (stat == 'twoPutts') {
                statName = "2 Putts";
                numerator = currentUser.twoPutts;
                denominator = currentUser.totalHolesPlayed_putts;
            }
            else if (stat == 'threePutts') {
                statName = "3 Putts or more";
                numerator = currentUser.threePuttsPLUS;
                denominator = currentUser.totalHolesPlayed_putts;
            }
            else if (stat == 'greensinReg') {
                statName = "Greens in Regulation";
                numerator = currentUser.greensInReg;
                denominator = currentUser.totalHolesPlayed_greensInReg;
            }
            else if (stat == 'fairwaysinReg') {
                statName = "Fairways in Regulation";
                numerator = currentUser.fairwaysInReg;
                denominator = currentUser.totalHolesPlayed_fairwaysInReg;
            }
            else if (stat == 'holesWithHazards') {
                statName = "Holes with Hazards";
                numerator = currentUser.holesWithHazard;
                denominator = currentUser.totalHolesPlayed_holesWithHazard;
            }

            // setting percentage
            percentage = numerator / denominator;

            const finalStatNum = (percentage * 100).toFixed(2);
            document.getElementById('lifetimePercentageWheel-text').innerHTML = String(numerator + ' / ' + denominator);

            // setting size of wheel to 70% of div height
            const divHeight = $(".percentageWheel").height();
            $('#lifetimePercentageWheel').attr('data-size', (0.70 * divHeight));

            // setting stat name to new value
            document.getElementById("lifetime-stat-name").innerHTML = statName;

            // hiding numbers
            document.getElementById('lifetimePercentageWheel-text').style.visibility = 'hidden';

            // wheel animation
            if (!isNaN(percentage)) {
                $("#lifetimePercentageWheel").circleProgress({ fill: { color: '#3b8ad9' }, value: percentage })
                    .on('circle-animation-progress', function (event, progress, stepValue) {
                        document.getElementById('lifetimePercentageWheel-percent').innerHTML = String(stepValue.toFixed(5).substr(2, 2) + '.' + stepValue.toFixed(5).substr(4, 2) + '%');
                    }).on('circle-animation-end', function () {
                        document.getElementById('lifetimePercentageWheel-percent').innerHTML = String(finalStatNum + '%');
                        document.getElementById('lifetimePercentageWheel-percent').style.color = '#ffffff';
                        document.getElementById('lifetimePercentageWheel-text').style.display = 'block';
                        document.getElementById('lifetimePercentageWheel-text').style.visibility = 'visible';
                    });
            }
            else {
                $("#lifetimePercentageWheel").circleProgress({ value: 0 });

                document.getElementById('lifetimePercentageWheel-text').style.display = 'none';
                document.getElementById('lifetimePercentageWheel-percent').innerHTML = String('N/A');
            }
        }
    });
}





function showFriend(displayName, uid) {
    const ul = document.getElementById("friends-list");

    var div = document.createElement("div");
    var userIconDiv = document.createElement("div");
    var userIcon = document.createElement("i");
    var h1 = document.createElement("h1");

    div.setAttribute('class', 'friendsList-div');
    userIconDiv.setAttribute('class', 'friendList-icon-div');
    userIcon.setAttribute('class', 'fas fa-user');
    h1.setAttribute('class', 'friendsList-h1');

    userIconDiv.onclick = function () { compareFriendsInfo(displayName, uid); }
    h1.onclick = function () { compareFriendsInfo(displayName, uid); }

    h1.appendChild(document.createTextNode(displayName));

    userIconDiv.appendChild(userIcon);

    div.appendChild(userIconDiv);
    div.appendChild(h1);

    ul.appendChild(div);
}

function compareFriendsInfo(displayName, uid) {
    // getting current users info
    const currentUserId = auth.currentUser.uid;

    // getting current users displayName
    database.collection('users').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        // set some header to displayName

        console.log("Getting " + currentUser.displayName + '\'s data...');

    });
    // getting all current user info
    database.collection('userData').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

    });

    // set some header to friends displayName
    console.log("Comparing to " + displayName + '\'s data...');

    // getting friends info
    database.collection('userData').doc(uid).get().then(snapshot => {
        const user = snapshot.data();

    });

    // hide original page
    document.getElementById('friends-list').style.display = 'none';

    // display new page
    document.getElementById('compare-friend-page').style.display = 'block';
}

function loadFriendsTab() {
    // clear div
    $('#friends-list').empty();

    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('userData').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        let myArray = currentUser.friends;

        // getting friends info and displaying them
        for (let i in myArray) {
            database.collection('users').doc(myArray[i]).get().then(snapshot => {
                const user = snapshot.data();
                showFriend(user.displayName, myArray[i]);
            });
        }
    });
}
