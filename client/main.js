import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.body.onCreated(function helloOnCreated() {
});

const hot_line = new ReactiveVar()

Template.body.helpers({
  html_code() {
    return hot_line.get();
  }
});


const left =new Uint16Array(1000);
const right =new Uint16Array(1000);
let leftx =0;
let rightx =1000

function insert_char(x) {
  console.log(`insert_char(${x})`)
  console.log(`left.x:${leftx} left:`,left)
  console.log(`right.x:${rightx} right:`,right)
  left[leftx] = x.charCodeAt(0); leftx+=1;
  console.log(`left.x:${leftx} left:`,left)
  console.log(`right.x:${rightx} right:`,right)
}
function delete_left(x) {
  leftx -=1;
}
function delete_right(x) {
  rightx +=1;
}

function move_left1() {
  rightx-=1; leftx -=1;
  right[rightx] = left[leftx];
}

function move_right1() {
  left[leftx] = right[rightx];
  rightx +=1; leftx +=1;
}


function move_left(n) {
  right.set(left.slice(leftx-n,leftx), rightx-n)
  rightx -=n; leftx -=n;
}

function move_right(n) {
  left.set(right.slice(rightx,rightx+n), leftx)
  rightx +=n; leftx +=n;
}

function move_home() {
  const n = leftx;
  right.set(left.slice(leftx-n,leftx), rightx-n)
  rightx -=n; leftx -=n;
}

function move_end() {
  const n = 1000-rightx;
  left.set(right.slice(rightx,rightx+n), leftx)
  rightx +=n; leftx +=n;
}

function clear_line() {
  leftx =0; rightx =1000;
}

/*
  insert character : push to te left
*/

Template.body.events({
  'click': ()=>{
    console.log('click')
  },
  'input': (e,tp)=>{
    console.log(e),
    console.log(`caret:`,this.selectionStart)
  },
  'keydown': (e,tp)=>{
    e.preventDefault();
    console.log(`Entering keydown.`)
    console.log(`left.x:${leftx} left:`,left)
    console.log(`right.x:${rightx} right:`,right)
    var keyCode = e.keyCode || e.which;
    console.log(`keydown keyCode:`,keyCode)
    switch (keyCode) {
      case 9:
        console.log('TAB'); //call custom function here
        break;
      case 37: move_left1(); break;
      case 39: move_right1(); break;
      default:
        insert_char(String.fromCharCode(keyCode));
        const a1 = left.slice(0,leftx);
        console.log(`a1:`,a1)
        const s2 = //String.fromCharCode(a1);
        String.fromCharCode.apply(null, new Uint8Array(a1));
        console.log(`s2:`,s2)
      // refresh: update a reactive variable.
        hot_line.set(s2);
    }
  }
});
