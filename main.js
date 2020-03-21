
function login() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    // check if user exists
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        toHomePage();
    }).catch(err => {
        document.getElementById('error-message').innerHTML = err.message;
        document.getElementById('error-message').style.visibility = 'visible';
    });
}

function signup() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    let displayName = document.getElementById('displayName-input').value;

    // if no display name, then set to email
    if (displayName == "") {
        displayName = email;
    }

    // create new user 
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        // creating all fields for user's data
        database.collection('users').doc(cred.user.uid).set({
            displayName: displayName,
            currentPar: 0,
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
            totalHolesPlayed: 0,
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

            shareTotalHolesPlayed: true,

            friends: []
        });
        toHomePage();
    }).catch(err => { // if there is an error, then display message
        document.getElementById('error-message').innerHTML = err.message;
        document.getElementById('error-message').style.visibility = 'visible';
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

function toSettingsPage() {
    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('users').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        hidePages();

        // display new stuff
        document.getElementById('settings-page').style.display = 'block';
        document.getElementById('page-label').innerHTML = "Settings";

        // setting values to data from firebase
        document.getElementById('displayName-setting-input').value = currentUser.displayName;
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
        document.getElementById('shareTotalHolesPlayed-toggle').checked = currentUser.shareTotalHolesPlayed;
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

    database.collection('users').doc(currentUserId).update({
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
        shareTotalHolesPlayed: document.getElementById('shareTotalHolesPlayed-toggle').checked
    });
    toHomePage();
}

// checking track settings -> if tracking is of, then turn off sharing
function checkTrackScores() {
    if (!document.getElementById('trackScores-toggle').checked) {
        document.getElementById('shareBirdiesMINUS-toggle').checked = false;
        document.getElementById('sharePars-toggle').checked = false;
        document.getElementById('shareBogeys-toggle').checked = false;
        document.getElementById('shareDoubleBogeysPLUS-toggle').checked = false;
    }
}
function checkTrackPutts() {
    if (!document.getElementById('trackPutts-toggle').checked) {
        document.getElementById('shareOnePutts-toggle').checked = false;
        document.getElementById('shareTwoPutts-toggle').checked = false;
        document.getElementById('shareThreePuttsPLUS-toggle').checked = false;
    }
}
function checkTrackHolesWithHazard() {
    if (!document.getElementById('trackHolesWithHazard-toggle').checked) {
        document.getElementById('shareHolesWithHazard-toggle').checked = false;
    }
}
function checkTrackFairwaysInReg() {
    if (!document.getElementById('trackFairwaysInReg-toggle').checked) {
        document.getElementById('shareFairwaysInReg-toggle').checked = false;
    }
}
function checkTrackGreensInReg() {
    if (!document.getElementById('trackGreensInReg-toggle').checked) {
        document.getElementById('shareGreensInReg-toggle').checked = false;
    }
}

// ****************************************************************************************************************************** \\

function toNewRoundPage() {
    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('users').doc(currentUserId).get().then(snapshot => {
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
        database.collection('users').doc(currentUserId).update({
            currentPar: 0,
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
            sleep(3.5).then(() => {
                document.getElementById("newRound-error-full").style.display = 'none';
                toHomePage();
            })
        }
    });
}

function nextQuestion(prevQuestion) {
    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('users').doc(currentUserId).get().then(snapshot => {
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
            }
            else if (prevQuestion == 3) {
                document.getElementById('Q3').style.display = 'none';

                if (currentUser.trackGreensInReg) {
                    document.getElementById('Q4').style.display = 'flex';
                }
                else if (currentUser.trackHolesWithHazard) {
                    document.getElementById('Q5').style.display = 'flex';
                }
            }
            else if (prevQuestion == 4) {
                document.getElementById('Q4').style.display = 'none';

                if (currentUser.trackHolesWithHazard) {
                    document.getElementById('Q5').style.display = 'flex';
                }
            }
        }
        else { // if it is the last question
            const holeNum = document.getElementById('hole-number').innerHTML;

            // hiding last question
            switch (lastQuestion) {
                case 5:
                    document.getElementById('Q5').style.display = 'none';
                    break;
                case 4:
                    document.getElementById('Q4').style.display = 'none';
                    break;
                case 3:
                    document.getElementById('Q3').style.display = 'none';
                    break;
                case 2:
                    document.getElementById('Q2').style.display = 'none';
                    break;
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

            database.collection('users').doc(currentUserId).update({
                totalHolesPlayed: currentUser.totalHolesPlayed + 1,
                currentTotalHolesPlayed: currentUser.currentTotalHolesPlayed + 1
            });
        }
    });
}

function makeTheTurn() {
    // getting current users info
    const currentUserId = auth.currentUser.uid;
    database.collection('users').doc(currentUserId).get().then(snapshot => {
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
//----------------------------------------------------------------------- delete this line

// do firebase stuff 

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
    database.collection('users').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        if (parValue != null && scoreValue != null) {
            // update to new values
            if (scoreValue < parValue) { // birdie or less
                database.collection('users').doc(currentUserId).update({
                    birdiesMINUS: currentUser.birdiesMINUS + 1,
                    currentBirdiesMINUS: currentUser.currentBirdiesMINUS + 1
                });
            }
            else if (scoreValue == parValue) { // par
                database.collection('users').doc(currentUserId).update({
                    pars: currentUser.pars + 1,
                    currentPars: currentUser.currentPars + 1
                });
            }
            else if (scoreValue == (parValue + 1)) { // bogey
                database.collection('users').doc(currentUserId).update({
                    bogeys: currentUser.bogeys + 1,
                    currentBogeys: currentUser.currentBogeys + 1
                });
            }
            else { // double bogey or more
                database.collection('users').doc(currentUserId).update({
                    doubleBogeysPLUS: currentUser.doubleBogeysPLUS + 1,
                    currentDoubleBogeysPLUS: currentUser.currentDoubleBogeysPLUS + 1
                });
            }

            database.collection('users').doc(currentUserId).update({
                currentPar: currentUser.currentPar + parValue,
            });
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
    database.collection('users').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        // update to new values
        if (puttsNum == 1) {
            database.collection('users').doc(currentUserId).update({
                onePutts: currentUser.onePutts + 1,
                currentOnePutts: currentUser.currentOnePutts + 1
            });
        }
        else if (puttsNum == 2) {
            database.collection('users').doc(currentUserId).update({
                twoPutts: currentUser.twoPutts + 1,
                currentTwoPutts: currentUser.currentTwoPutts + 1
            });
        }
        else { // 3+
            database.collection('users').doc(currentUserId).update({
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
    database.collection('users').doc(currentUserId).get().then(snapshot => {
        const currentUser = snapshot.data();

        // update to new values
        if (questionNum == 3) { // fairways in regulation
            database.collection('users').doc(currentUserId).update({
                fairwaysInReg: currentUser.fairwaysInReg + 1,
                currentFairwaysInReg: currentUser.currentFairwaysInReg + 1
            });
        }
        else if (questionNum == 4) { // greens in regulation
            database.collection('users').doc(currentUserId).update({
                greensInReg: currentUser.greensInReg + 1,
                currentGreensInReg: currentUser.currentGreensInReg + 1
            });
        }
        else { // hazards
            database.collection('users').doc(currentUserId).update({
                holesWithHazard: currentUser.holesWithHazard + 1,
                currentHolesWithHazard: currentUser.currentHolesWithHazard + 1
            });
        }
    });

    nextQuestion(questionNum);
}

// ****************************************************************************************************************************** \\

function toFriendsPage() { // put all inside .then()
    hidePages();

    // display new stuff
    document.getElementById('friends-page').style.display = 'block';
    document.getElementById('page-label').innerHTML = "Friends";
}

function toStatsPage() { // put all inside .then()
    // only accessible from home page
    document.getElementById('home-page').style.display = 'none';

    // display new stuff
    document.getElementById('stats-page').style.display = 'block';
    document.getElementById('page-label').innerHTML = "Stats";
}


function toPreviousRoundStats() {
    toHomePage(); // for testing
}