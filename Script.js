//@input Component.ScreenTransform vegetableImage
//@input Component.ScreenTransform junkFoodImage
//@input Component.ScreenTransform tomatoImage
//@input Component.ScreenTransform greasyImage
//@input SceneObject mouthPositionObject
//@input Component.Camera camera
//@input float fallSpeed = 5.0
//@input float threshold = 0.15
//@input Component.FaceStretchVisual stretch
//@input Component.Text scoreNumber
//@input Component.Text topScoreNumber

// @input Component.AudioComponent backgroundSounds
// @input Component.AudioComponent eatingSounds
// @input Component.AudioComponent levelUpSound
// @input Component.AudioComponent gameOverSound
// @input Component.AudioComponent greasySound
// @input Component.AudioComponent popSound
// @input Component.AudioComponent jingleSound

//@input SceneObject gameOverObject
//@input SceneObject startBtnObject
//@input SceneObject restartBtnObject

//@input SceneObject startUI
//@input SceneObject level2Object
//@input SceneObject level3Object

//@input Component.ScreenTransform[] heartImages

// @input SceneObject snowfall

// Bind to LensTurnOnEvent to start the snowfall when the lens is turned on
var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOn);

// Bind to StartGame event to stop the snowfall when the game starts
global.behaviorSystem.addCustomTriggerResponse("StartGame", startGame);

function onLensTurnOn(eventData) {
    // Start playing the jingle sound when the lens is turned on
    script.jingleSound.play(1);

    // Start the snowfall when the lens is turned on
    script.snowfall.enabled = true;
}


// Initialize random positions for each image at the start
randomizeStartPosition(script.vegetableImage);
randomizeStartPosition(script.junkFoodImage);
randomizeStartPosition(script.tomatoImage);

// The levels
const GameStates = {
    LEVEL_1: "Level1",
    LEVEL_2: "Level2",
    LEVEL_3: "Level3",
    // Add more levels as needed
};

// Set the current game state to Level 1
var currentGameState = GameStates.LEVEL_1;

// Track whether greasyImage should be enlarged (true) or reduced (false)
var enlargeGreasyImage = false; 


// Maximum scale for the greasy image
var maxScale = 1.0;

// Initialize the score variable
var score = 0;


// Bind the update function to the UpdateEvent
var updateEvent = script.createEvent("UpdateEvent");

var audioComponent = script.getSceneObject().createComponent("Component.AudioComponent");


global.behaviorSystem.addCustomTriggerResponse("startGame", startGame);
global.behaviorSystem.addCustomTriggerResponse("restartGame", restartGame);

var startgame = false;
//var restartgame = false;

var heartCount;

var store = global.persistentStorageSystem.store;

var topScoreKey = "topScore";
script.topScoreNumber.text = store.getInt(topScoreKey).toString();
function startGame() {
    heartCount = 3;
    heartUI();
    print("start")
    script.startBtnObject.enabled = false;
    script.startUI.enabled = false;
    script.snowfall.enabled = false;
    startgame = true;
    // Stop the jingle sound when the game starts
    script.jingleSound.stop(1);
    script.popSound.play(1);
    script.backgroundSounds.play(1);
}
function restartGame() {
    heartCount = 3;
    heartUI();
    print("restart")
    script.stretch.setFeatureWeight("Feature0", junkFoodCount = 0);
    script.vegetableImage.getSceneObject().enabled = true;
    script.junkFoodImage.getSceneObject().enabled = true;
    script.tomatoImage.getSceneObject().enabled = true;

    score = 0;
    currentGameState = GameStates.LEVEL_1;
    script.restartBtnObject.enabled = false;
    script.gameOverObject.enabled = false;
    startgame = true;

    script.backgroundSounds.play(1);

    updateUI();
}
function heartUI()
{
    for (var i = 0; i < 3; i++)
    {
        if (heartCount > i) {
            script.heartImages[i].getSceneObject().enabled = true;
        }
        else {
            script.heartImages[i].getSceneObject().enabled = false;
        }
    }

    
}

updateEvent.bind(function (eventData) {
    if (startgame) {
        update(eventData);
    }
});


// Function to update the UI with the current score
function updateUI() {
    if (typeof score === 'number') {
        script.scoreNumber.text = score.toString();
    } else {
        print("Error: 'score' is not a number.");
    }
}

function incrementScore(foodType) {
    // Increment the score based on the type of food
    if (foodType === "vegetable") {
        score += 10; // Adjust the score as needed
    } else if (foodType === "junk food") {
        score -= 5; // Adjust the score as needed
    } else if (foodType === "tomato") {
        score += 5; // Adjust the score as needed
    }

    // You can perform additional actions based on the score if needed
    print("Score: " + score);
    // Update the UI
    updateUI();
}


// Function to check for level transition
function checkForLevelTransition() {
    // Check if the score reaches a certain threshold to trigger level transition
    if (score >= 30 && currentGameState === GameStates.LEVEL_1) {
        // Transition to Level 2
        currentGameState = GameStates.LEVEL_2;
        
        print("Transition to Level 2");
        script.levelUpSound.play(1);
        script.level2Object.enabled = true;
        
        // Add a delay before disabling script.level2Object (e.g., 2 seconds)
        var delayInSeconds = 2;
        var timer = delayInSeconds;

        // Continue with other setup or logic immediately
        handleLevelSetup();

        // Use a flag to determine whether the update logic should continue
        var continueUpdate = true;

        // Bind the update event to check for the delay
        script.createEvent("UpdateEvent").bind(function (eventData) {
            if (continueUpdate) {
                timer -= eventData.getDeltaTime();

                // Check if the delay has expired
                if (timer <= 0) {
                    // Disable script.level2Object after the delay
                    script.level2Object.enabled = false;

                    // Set the flag to stop checking for the delay
                    continueUpdate = false;
                }
            }
        });
        
    }
    else if (score >= 50 && currentGameState === GameStates.LEVEL_2)
    {
        // Transition to Level 3
        currentGameState = GameStates.LEVEL_3;

        print("Transition to Level 3");
        script.levelUpSound.play(1);
        script.level3Object.enabled = true;

        // Add a delay before disabling script.level3Object (e.g., 2 seconds)
        var delayInSeconds = 2;
        var timer = delayInSeconds;

        // Continue with other setup or logic immediately
        handleLevelSetup();

        // Use a flag to determine whether the update logic should continue
        var continueUpdate = true;

        // Bind the update event to check for the delay
        script.createEvent("UpdateEvent").bind(function (eventData) {
            if (continueUpdate) {
                timer -= eventData.getDeltaTime();

                // Check if the delay has expired
                if (timer <= 0) {
                    // Disable script.level2Object after the delay
                    script.level3Object.enabled = false;

                    // Set the flag to stop checking for the delay
                    continueUpdate = false;
                }
            }
        });

    }
}

var sideSpawn = false;

function handleLevelSetup() {
    // Perform setup based on the current game state (level)
    switch (currentGameState) {
        case GameStates.LEVEL_1:
            setupLevel1();
            break;
        case GameStates.LEVEL_2:
            setupLevel2();
            break;
        case GameStates.LEVEL_3:
            setupLevel3();
            break;
        // Add more cases for additional levels
        default:
            break;
    }
}

function setupLevel2() {

    script.fallSpeed = 20.0; 
    script.threshold = 0.1; 

    //score = 0;
    updateUI();



}

function setupLevel3()
{
    // Set up items for Level 3
    script.fallSpeed = 5.0; 
    script.threshold = 0.1; 

    //score = 0;
    updateUI();

    // Ensure that objects start outside the screen
    randomizeStartPosition2(script.vegetableImage);
    randomizeStartPosition2(script.junkFoodImage);
    randomizeStartPosition2(script.tomatoImage);
}


var enlargeTimer;

function update(eventData) {
    var deltaTime = eventData.getDeltaTime();
    var mouthPosition = getMouthPosition(); // Get the mouth's screen position

    // Update the position of each image and check for collisions
    if (currentGameState === GameStates.LEVEL_1) {
        checkAndMoveImage(script.vegetableImage, deltaTime, mouthPosition, "vegetable");
        checkAndMoveImage(script.junkFoodImage, deltaTime, mouthPosition, "junk food");
        checkAndMoveImage(script.tomatoImage, deltaTime, mouthPosition, "tomato");
    }

    if (currentGameState === GameStates.LEVEL_2) {
        checkAndMoveImage(script.vegetableImage, deltaTime, mouthPosition, "vegetable");
        checkAndMoveImage(script.junkFoodImage, deltaTime, mouthPosition, "junk food");
        checkAndMoveImage(script.tomatoImage, deltaTime, mouthPosition, "tomato");
        rotateFallingObjects(deltaTime);
    }
    if (currentGameState === GameStates.LEVEL_3) {
        checkAndMoveImage2(script.vegetableImage, deltaTime, mouthPosition, "vegetable");
        checkAndMoveImage2(script.junkFoodImage, deltaTime, mouthPosition, "junk food");
        checkAndMoveImage2(script.tomatoImage, deltaTime, mouthPosition, "tomato");
    }

    // Scale the greasy image based on the enlargeGreasyImage flag
if (enlargeGreasyImage)
{

    if (enlargeTimer <= 0)
    {
        reduceGreasyImageSize();
        return;
    }

    enlargeTimer -= deltaTime;
    //script.greasyImage.getSceneObject().enabled = true;
    enlargeGreasyImageSize();
}

    
    // Check for level transition
    checkForLevelTransition();

}

function rotateFallingObjects(deltaTime) {
    // Rotate the falling objects
    var rotationSpeed = 180.0; // Adjust the rotation speed as needed (degrees per second)

    // Rotate the vegetable image around the Z-axis
    var vegetableTransform = script.vegetableImage.getSceneObject().getTransform();
    vegetableTransform.setLocalRotation(quat.angleAxis(
        rotationSpeed * deltaTime, new vec3(0, 0, 10)
    ));

    // Rotate the junk food image around the Z-axis
    var junkFoodTransform = script.junkFoodImage.getSceneObject().getTransform();
    junkFoodTransform.setLocalRotation(quat.angleAxis(
        rotationSpeed * deltaTime, new vec3(0, 0, 10)
    ));

    // Rotate the tomato image around the Z-axis
    var tomatoTransform = script.tomatoImage.getSceneObject().getTransform();
    tomatoTransform.setLocalRotation(quat.angleAxis(
        rotationSpeed * deltaTime, new vec3(0, 0, 10)
    ));
}

var junkFoodCount = 0;
function checkAndMoveImage(imageTransform, deltaTime, mouthPosition, foodType)
{
    if (script.gameOverObject.enabled == true)
    {
        imageTransform.getSceneObject().enabled = false;
        return;
    }
    // Check if the imageTransform is valid
    if (imageTransform && imageTransform.anchors) {
        moveDownWithDelay(imageTransform, deltaTime);

        // Perform collision check with the mouth position
        var imagePosition = imageTransform.anchors.getCenter();
        var distanceFromMouth = getDistance(imagePosition, mouthPosition);

        // If the object is close enough to the mouth, deactivate it and set the enlargeGreasyImage flag
        if (distanceFromMouth < script.threshold)
        {
            imageTransform.getSceneObject().enabled = false;
            randomizeStartPosition(imageTransform);

            // Increment the score based on the type of food
            incrementScore(foodType);
           
            script.eatingSounds.play( 1 );
            

            if (imageTransform === script.junkFoodImage)
            {
                heartCount--;
                heartUI();
                junkFoodCount += 0.33;
                if (heartCount <= 0)
                {
                    junkFoodCount = 1;
                    script.gameOverObject.enabled = true;
                    // Show greasyImage when junkFoodCount reaches 1
                    //script.greasyImage.getSceneObject().enabled = true;
                    script.gameOverSound.play(1);
                    script.restartBtnObject.enabled = true;
                    var topScore = store.getInt(topScoreKey);
                    print(topScore);
                    if (score > topScore) {

                        store.putInt(topScoreKey, score);
                        topScore = score;
                        print(score);
                    }
                    script.topScoreNumber.text = topScore.toString();
                    //script.backgroundSounds.stop(1);
                    
                }
                script.stretch.setFeatureWeight("Feature0", junkFoodCount);

                // Set the flag to enlarge the greasy image when JunkfoodObject disappears
                if (enlargeGreasyImage == false) {
                    enlargeTimer = 1;
                    enlargeGreasyImage = true;
                    script.greasyImage.getSceneObject().enabled = true;
                    script.greasyImage.getTransform().setLocalScale(new vec3(0.4, 0.4, 0.4));
                }
                
            }
            else
            {
                heartCount += 1;
                if (heartCount >= 3)
                    heartCount = 3;
                heartUI();
                junkFoodCount -= 0.33;
                if (junkFoodCount <= 0)
                    junkFoodCount = 0;
                script.stretch.setFeatureWeight("Feature0", junkFoodCount);

                // Set the flag to reduce the greasy image size when any other object disappears

                enlargeGreasyImage = false;
            }
        }
    }
}
function checkAndMoveImage2(imageTransform, deltaTime, mouthPosition, foodType) {
    if (script.gameOverObject.enabled == true) {
        imageTransform.getSceneObject().enabled = false;
        return;
    }
    // Check if the imageTransform is valid
    if (imageTransform && imageTransform.anchors) {
        moveDownWithDelay2(imageTransform, deltaTime);

        // Perform collision check with the mouth position
        var imagePosition = imageTransform.anchors.getCenter();
        var distanceFromMouth = getDistance(imagePosition, mouthPosition);

        // If the object is close enough to the mouth, deactivate it and set the enlargeGreasyImage flag
        if (distanceFromMouth < script.threshold) {
            imageTransform.getSceneObject().enabled = false;
            randomizeStartPosition2(imageTransform);

            // Increment the score based on the type of food
            incrementScore(foodType);

            script.eatingSounds.play(1);


            if (imageTransform === script.junkFoodImage) {
                heartCount--;
                heartUI();
                junkFoodCount += 0.33;
                if (heartCount <= 0) {
                    junkFoodCount = 1;
                    script.gameOverObject.enabled = true;
                    script.gameOverSound.play(1);
                    
                    script.restartBtnObject.enabled = true;
                    var topScore = store.getInt(topScoreKey);
                    print(topScore);
                    if (score > topScore) {

                        store.putInt(topScoreKey, score);
                        topScore = score;
                        print(score);
                    }
                    script.topScoreNumber.text = topScore.toString();

                }
                script.stretch.setFeatureWeight("Feature0", junkFoodCount);

                // Set the flag to enlarge the greasy image when JunkfoodObject disappears
                if (enlargeGreasyImage == false) {
                    enlargeTimer = 1;
                    enlargeGreasyImage = true;
                    script.greasyImage.getSceneObject().enabled = true;
                    script.greasyImage.getTransform().setLocalScale(new vec3(0.4, 0.4, 0.4));
                }

            }
            else {
                heartCount += 1;
                if (heartCount >= 3)
                    heartCount = 3;
                heartUI();
                junkFoodCount -= 0.33;
                if (junkFoodCount <= 0)
                    junkFoodCount = 0;
                script.stretch.setFeatureWeight("Feature0", junkFoodCount);

                // Set the flag to reduce the greasy image size when any other object disappears

                enlargeGreasyImage = false;
            }
        }
    }
}

function moveDownWithDelay(imageTransform, deltaTime) {
    // If imageTransform is not valid or the SceneObject is not enabled, exit early
    if (!imageTransform || !imageTransform.getSceneObject() || !imageTransform.getSceneObject().enabled) return;

    // Add a delay property if it doesn't exist
    if (!imageTransform.hasOwnProperty('delay')) {
        imageTransform.delay = Math.random() * 2; // Random delay between 0 and 2 seconds
        imageTransform.fallSpeed = script.fallSpeed + (Math.random() - 0.5) * 1.0; // Randomize fall speed but keep it reasonable
    }

    // Move the image down after the delay has passed
    if (imageTransform.delay > 0) {
        imageTransform.delay -= deltaTime;
    } else {
        var currentY = imageTransform.anchors.getCenter().y;
        var newY = currentY - imageTransform.fallSpeed * deltaTime;

        imageTransform.anchors.setCenter(new vec2(imageTransform.anchors.getCenter().x, newY));

        // Reset the image position if it goes off the bottom of the screen
        if (newY < -1.5) {
            randomizeStartPosition(imageTransform);
        }
    }
}
function moveDownWithDelay2(imageTransform, deltaTime) {


    // If imageTransform is not valid or the SceneObject is not enabled, exit early
    if (!imageTransform || !imageTransform.getSceneObject() || !imageTransform.getSceneObject().enabled) return;

    // Add a delay property if it doesn't exist
    if (!imageTransform.hasOwnProperty('delay')) {
        imageTransform.delay = Math.random() * 2; // Random delay between 0 and 2 seconds
        imageTransform.fallSpeed = script.fallSpeed *0.3 + (Math.random() - 0.5) * 1.0; // Randomize fall speed but keep it reasonable
    }

    // Move the image down after the delay has passed
    if (imageTransform.delay > 0) {
        imageTransform.delay -= deltaTime;
    } else {
        var currentX = imageTransform.anchors.getCenter().x;
        var newX = currentX + imageTransform.direction * script.fallSpeed * 0.3 * deltaTime; // '+' �ϸ� ���������� ��
        imageTransform.anchors.setCenter(new vec2(newX, imageTransform.anchors.getCenter().y));

        // Reset the image position if it goes off the bottom of the screen
        if (imageTransform.direction == 1) {
            if (newX > 1) {
                randomizeStartPosition2(imageTransform);
            }
        }
        if (imageTransform.direction == -1) {
            if (newX < -1) {
                randomizeStartPosition2(imageTransform);
            }
        }
    }
}

function randomizeStartPosition(imageTransform) {


    var randomX = (Math.random() * 2.0 - 1.0); // Random X between -1 and 1 for the full width of the screen


    var initialScale = 0.3; // Adjust the initial scale as needed

    imageTransform.anchors.setCenter(new vec2(randomX, 1.5)); // Start above the top of the screen

    // Set initial scale using the transform component
    imageTransform.getTransform().setLocalScale(new vec3(initialScale, initialScale, 1.0));

    // Re-enable the SceneObject if it was previously disabled
    if (imageTransform.getSceneObject() && !imageTransform.getSceneObject().enabled) {
        imageTransform.getSceneObject().enabled = true;
    }

} 
function randomizeStartPosition2(imageTransform) {

    let direction = Math.random() < 0.5 ? -1 : 1; // [Conditions] ? [true] : [false]
    imageTransform.direction = direction; //Add a direction to the direction of the image

    let randomY = ((Math.random() * 2) - 1) * 0.5; //between -2~ 2 random value



    var initialScale = 0.3; // Adjust the initial scale as needed

    if (imageTransform.direction == 1) 
    {
        imageTransform.anchors.setCenter(new vec2(-direction*2, randomY)); // Start above the top of the screen
    }
    else if (imageTransform.direction == -1) {
        imageTransform.anchors.setCenter(new vec2(-direction*2, randomY));
    }
    // Set initial scale using the transform component
    imageTransform.getTransform().setLocalScale(new vec3(initialScale, initialScale, 1.0));

    // Re-enable the SceneObject if it was previously disabled
    if (imageTransform.getSceneObject() && !imageTransform.getSceneObject().enabled){
        imageTransform.getSceneObject().enabled = true;
    }


} 


function getDistance(pos1, pos2) {
    var xDistance = Math.abs(pos1.x - pos2.x);
    var yDistance = Math.abs(pos1.y - pos2.y);
    var aspectRatio = script.camera.aspect;
    yDistance *= aspectRatio; // Adjust for the screen's aspect ratio
    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
}

function getMouthPosition() {
    var mouthWorldPos = script.mouthPositionObject.getTransform().getWorldPosition();
    var mouthPos = script.camera.worldSpaceToScreenSpace(mouthWorldPos);
    // Convert the mouth position from [0, 1] range to [-1, 1] range for both X and Y
    mouthPos = new vec2(mouthPos.x * 2 - 1, 1 - mouthPos.y * 2);
    return mouthPos;
}

function enlargeGreasyImageSize() {
    var currentScale = script.greasyImage.getTransform().getLocalScale();
    var newScale = new vec3(currentScale.x + 0.1, currentScale.y + 0.1, currentScale.z);
    if (newScale.x <= maxScale && newScale.y <= maxScale) {
        script.greasyImage.getTransform().setLocalScale(newScale);
        
        // Play the sound as soon as the condition is met
        if(!script.gameOverObject.enabled==true){
            script.greasySound.play(1);
        }
    }
}

function reduceGreasyImageSize() {
    var currentScale = script.greasyImage.getTransform().getLocalScale();
    var newScale = new vec3(currentScale.x - 0.1, currentScale.y - 0.1, currentScale.z);
    if (newScale.x >= 0.1 && newScale.y >= 0.1) {
        script.greasyImage.getTransform().setLocalScale(newScale);
    }
    else {
        // enough small
        enlargeGreasyImage = false;
        script.greasyImage.getSceneObject().enabled = false;
    }
}


