/**
 * Elevator Simulation Project
 * 
 * Description:
 * A visual elevator simulation using Phaser.js.
 * Users can input floor numbers, and the elevator moves with animation.
 *
 * Author: Daniel Faubel
 * Date: 2025-05-29
 */

const config = {
    type: Phaser.AUTO,
    width: 400,
    height:640,
    backgroundColor: '#000011',
    parent: 'elevator-grid',
    physics:{
        default: 'arcade',
            arcade:{
                debug: false
            }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const elevatorProject = new Phaser.Game(config);
const outputEl= document.getElementById("output-container");
const gridContainer = document.getElementById('elevator-grid');
const FirstFloorY = 10;
let elevatorState;
let floor = null;
let elevator;
let newY;
let timer;
let totalTime;
let isStart = true;
let floorsTraveled = '';

const FLOOR_COUNT = 32;
const FLOOR_HEIGHT = 18.75; 
const GRID_TOP = 0;
const GRID_BOTTOM = FLOOR_COUNT * FLOOR_HEIGHT; // 600


function preload(){
    this.load.image('elevator', 'assets/Elevator.png');

}

function create(){
    elevator = this.physics.add.sprite(400, 609.375, 'elevator');
    elevator.setCollideWorldBounds(true); // we'll handle bounds manually
    camera = this.cameras.main; // Reference to the main camera
    outputEl.innerHTML += `Enter a start floor number.`;
    elevatorState = "Idle";
    gameScene = this;
    cursors = this.input.keyboard.createCursorKeys();
    
    gameScene = this;
    timer = 0;
    totalTime = 0;
    newY = elevator.y;

    drawSceneGrid(this);
}
function update(){
    updateElevatorPosition();
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("user-input");

    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const value = input.value.trim();
            if (value !== "") {
                console.log("User entered:", value);
                handleUserInput(value);
                input.value = "";
            }
        }
    });
});

function handleUserInput(value) {

    const floor = parseInt(value, 10);
    const outputEl = document.getElementById("output-container");
    
    if (elevatorState !== "Idle"){
        outputEl.innerHTML += `<br>Please wait for the elevator to arrive.`;
        return;
    }
   
    if (isNaN(floor)) {
        outputEl.innerHTML += `<br>"${value}" is not a valid floor number.`;
        return;
    }
    
    if(floor < 1 || floor > 32){
        outputEl.innerHTML += `<br>Floor ${floor} is out of range. Please enter a number between 1 and 32.`;
        return;
    }
    if(isStart === true){
        outputEl.innerHTML += `<br>Starting on floor ${floor}.`;
        floorsTraveled = `${floor}`;
        isStart = false; 
    }
    else{
        outputEl.innerHTML += `<br>Going to floor ${floor}.`;
    }
    moveElevator(floor);

}

function drawSceneGrid(scene) {
    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.3); // white, semi-transparent
    
    const GRID_HEIGHT = FLOOR_COUNT * FLOOR_HEIGHT;
    const CANVAS_HEIGHT = 640;
    const GRID_OFFSET_Y = (CANVAS_HEIGHT - GRID_HEIGHT) / 2;
    
    for (let i = 0; i <= FLOOR_COUNT; i++) {
        const y = GRID_OFFSET_Y  + i * FLOOR_HEIGHT;
        graphics.beginPath();
        graphics.moveTo(0, y);
        graphics.lineTo(400, y);
        graphics.strokePath();
    }
     // Draw vertical lines (columns)
    const columnCount = 2;
    const col1Width = 380;
    const col2Width = 20;
    const totalWidth = col1Width + col2Width;

    // Draw vertical lines at start, col1 end, and total end
    const xPositions = [0, col1Width, totalWidth];

    for (let j = 0; j <= columnCount; j++) {
        const x = xPositions[j];
        graphics.beginPath();
        graphics.moveTo(x, GRID_OFFSET_Y);
        graphics.lineTo(x, GRID_OFFSET_Y + GRID_HEIGHT); // canvas height
        graphics.strokePath();
    }

    // Optional: label floors in left column
    for (let i = 0; i < FLOOR_COUNT; i++) {
        const floorNum = FLOOR_COUNT - i;
        const labelY = GRID_OFFSET_Y + i * FLOOR_HEIGHT + 2;
        scene.add.text(5, labelY, `Floor ${floorNum}`, {
            fontSize: '12px',
            color: '#ffffff'
        });
    }

}

function moveElevator(newFloor){
    if(floor === null){
        floor = newFloor;
        elevator.y = getYForFloor(newFloor);
        newY = getYForFloor(newFloor);

    }
    else{
        floor = newFloor;
        newY = getYForFloor(newFloor);
    }
}

function updateElevatorPosition(){
    if(elevator.y > newY){
        elevator.y -= 18.75 /(6);
        elevatorState = "Going Up";
        timer += 1/6;
        totalTime += 1/6;
    }
    else if(elevator.y < newY){
        elevator.y += 18.75 /(6);
        elevatorState = "Going Down";
        timer += 1/6;
        totalTime += 1/6;
    }
    else if(elevator.y === newY){
        if(elevatorState !== "Idle"){
            outputStateChange(timer, floor);
            floorsTraveled += `, ${floor}`;
        }
        elevatorState = "Idle";
        timer = 0;
    }
}

function getYForFloor(floor) {
    const GRID_HEIGHT = FLOOR_COUNT * FLOOR_HEIGHT;
    const CANVAS_HEIGHT = 640;
    const GRID_OFFSET_Y = (CANVAS_HEIGHT - GRID_HEIGHT) / 2;
    
    return GRID_OFFSET_Y + (FLOOR_COUNT - floor) * FLOOR_HEIGHT + FLOOR_HEIGHT / 2;
}

function outputStateChange(timer, floor){
    const outputEl = document.getElementById("output-container");
    outputEl.innerHTML += `<br>Travel Time: ${timer.toFixed(1)*10} Seconds.` 
    + `<br>Arrived At Floor Number ${floor.toFixed(0)}.`
    + `<br>Total Travel Time: ${totalTime.toFixed(1)*10} Seconds.`
    + `<br>Floors Traveled: ${floorsTraveled}.`;
}
