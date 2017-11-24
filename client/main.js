import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.main.onCreated(function() {
  this.subscribe("serial/rx");
  this.refresher = new ReactiveVar(new Date());
  this.handle = Meteor.setInterval(()=>this.refresher.set(new Date), 1000);
});
Template.main.helpers({
  "packets": ()=> serialCollection.find({}, {
    sort: {
      createdAt: -1
    },
    limit: 7
  }).map(o=>o).reverse(),
  "fromNow": (time)=>{
    Template.instance().refresher.get();
    console.log(time);
    return moment(time).fromNow()
  }
});
Template.main.events({
  /* wifi.sta.getap(function(t) for k,v in pairs(t) do print(k..":"..v) end end) */
  "submit": (e)=> {
    Meteor.call("serial/tx", e.currentTarget.command.value + "\n", ()=>{
      e.currentTarget.command.value = "";
    });
    e.preventDefault();
  }
});
Template.main.onDestroyed(function() {
  Meteor.clearInterval(this.handle);
});