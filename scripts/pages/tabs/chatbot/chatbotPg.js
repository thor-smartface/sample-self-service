/* globals swipeViewIndex */
const extend = require('js-base/core/extend');
const ChatbotPgDesign = require('ui/ui_chatbotPg');
const ChatBotReplyStructure = require('components/ChatBotReplyStructure');
const FlexLayout = require('sf-core/ui/flexlayout');
const addChild = require("@smartface/contx/lib/smartface/action/addChild");
const Color = require('sf-core/ui/color');
const WebSocket = require('sf-core/net/websocket');
const Router = require('sf-core/router');
const PageFinder = require("./PageFinder");
const Timer = require("sf-core/timer");
const Image = require('sf-core/ui/image');
const AlertView = require('sf-core/ui/alertview');
const Screen = require('sf-core/device/screen');
const Font = require('sf-core/ui/font');
const ScrollView = require('sf-core/ui/scrollview');
const ListViewItem = require('sf-core/ui/listviewitem');
const System = require('sf-core/device/system');
var mixinDeep = require('mixin-deep');



var noInclude = '_NOINCLUDE,';

const ChatbotPg = extend(ChatbotPgDesign)(
  // Constructor
  function(_super) {
    // Initalizes super class for this page scope
    _super(this);
    // overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    // overrides super.onLoad method
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
  });

function Message(params) {
  this.message;
  this.mainComUserProps;
  this.chatBotLabelUserProps;
  this.contentflUserProps;
  this.messageIconImageViewUserProps;

  if (params) {
    for (var param in params) {
      this[param] = params[param];
    }
  }

}

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
var chatbotWebSocket = null;

function onShow(superOnShow) {
  superOnShow();

  const page = this;

  this.sendLabel.onTouch = clientSend.bind(this);

  chatbotWebSocket.onMessage = function(e) {
    console.log("Message received." + e.string);
    var data = e.string;

    if (data.search(noInclude) === -1) {
      var text = data;
      var constString = "Succeeded! I am navigating you to "
      var evaluateData = constString.concat(" ", text + " page.. ");
      onReply.call(page, evaluateData);

      //sets timer to enable to user intract with chatbot
      nativagetFoundPage(text);
    }
    else {
      var evalateData = data.replace(noInclude, "");
      onReply.call(page, evalateData);
    }
    console.log("message is " + JSON.stringify(e));
  };
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();

  const page = this;

  page.chatDatas = [];

  chatbotWebSocket = new WebSocket({ url: "https://safe-sands-45992.herokuapp.com" });

  page.layoutHeaderBar.headerBarTitle.text = "ChatBot"

  page.layoutHeaderBar.rightItem1.width = 25;
  page.layoutHeaderBar.rightItem1.height = 25;
  page.layoutHeaderBar.rightItem1.image = Image.createFromFile("images://ic_info_outline_white.png")

  page.layoutHeaderBar.rightItem1.onTouch = function() {
    initAlert.call(page).show();
  }.bind(page)


  initListView.call(this);
}

function initListView() {
  const page = this;

  page.chatbotListview.refreshEnabled = false;

  // page.chatbotListview.rowHeight = 100;
  page.chatbotListview.itemCount = page.chatDatas.length;

  page.chatbotListview.onRowHeight = function(index) {
    var message = page.chatDatas[index];


    return message.mainComUserProps.userStyle.maxHeight;
  }
  var indexListItem = 0;
  page.chatbotListview.onRowCreate = function() {
    var myListViewItem = new ListViewItem();

    var chatBotReplyStructure = new ChatBotReplyStructure();
    page.chatbotListview.dispatch(addChild(`item${++indexListItem}`, chatBotReplyStructure));

    myListViewItem.addChild(chatBotReplyStructure, "chatBotReplyStructure");

    return myListViewItem;
  };

  page.chatbotListview.onRowBind = function(listViewItem, index) {
    var chatBotReplyStructure = listViewItem.findChildById(100);
    var contentfl = chatBotReplyStructure.findChildById(101);
    var messageIconImageView = chatBotReplyStructure.findChildById(102);
    var chatBotLabel = contentfl.findChildById(103);

    var chatData = page.chatDatas[index];

    chatBotLabel.text = chatData.message;

    if (chatData.mainComUserProps && chatData.chatBotLabelUserProps && chatData.contentflUserProps && chatData.messageIconImageViewUserProps) {

      chatBotReplyStructure.dispatch(chatData.mainComUserProps);

      contentfl.dispatch(chatData.contentflUserProps);

      messageIconImageView.dispatch(chatData.messageIconImageViewUserProps);

      chatBotLabel.dispatch(chatData.chatBotLabelUserProps);

    }
    else {
      chatBotReplyStructure.dispatch(chatData.mainComUserProps);
    }
  };
}

//bind must be
function clientSend() {
  const page = this;

  var text = page.sendText.text;
  var sizeOfLabelObj = sizeOfLabel(text);

  if (text) {
    var mainComUserProps = {
      type: "updateUserStyle",
      userStyle: {
        marginTop: 15,
        marginRight: 5,
        marginLeft: 5,
        width: null,
        maxHeight: Math.ceil(sizeOfLabelObj.height),
        maxWidth: Math.ceil(sizeOfLabelObj.width),
        flexGrow: 1,
        flexDirection: "ROW_REVERSE",
        positionType: "RELATIVE",
        alignSelf: "FLEX_END"
      }
    }

    var chatBotLabelUserProps = {
      type: "updateUserStyle",
      userStyle: {
        textColor: "#FFFFFF",
        backgroundColor: "#4A90E2"
      }
    };

    var contentflUserProps = {
      type: "updateUserStyle",
      userStyle: {
        backgroundColor: "#4A90E2"
      }
    };

    var messageIconImageViewUserProps = {
      type: "updateUserStyle",
      userStyle: {
        width: 0,
        height: 0,
        visible: false
      }
    };

    var message = new Message({
      message: text,
      mainComUserProps: mainComUserProps,
      chatBotLabelUserProps: chatBotLabelUserProps,
      contentflUserProps: contentflUserProps,
      messageIconImageViewUserProps: messageIconImageViewUserProps
    });

    page.chatDatas.push(message);
    updateList.call(this);
    replyToWs(text);
  }
  else {
    alert("Please enter something");
  }
}

//must be bind
function onReply(text) {
  const page = this;

  var sizeOfLabelObj = sizeOfLabel(text);

  if (text) {

    var mainCompUserProps = {
      type: "updateUserStyle",
      userStyle: {
        marginTop: 15,
        marginRight: 5,
        marginLeft: 5,
        width: null,
        maxWidth: Math.ceil(sizeOfLabelObj.width),
        maxHeight: Math.ceil(sizeOfLabelObj.height),
        flexGrow: 1,
        flexDirection: "ROW",
        positionType: "RELATIVE",
        alignSelf: "FLEX_START"
      }
    };

    var message = new Message({
      message: text,
      mainComUserProps: mainCompUserProps
    });

    page.chatDatas.push(message);

    updateList.call(this);
  }
  else {
    alert("Please enter something");
  }
}


function replyToWs(text) {
  chatbotWebSocket.send({ data: text });
}

function nativagetFoundPage(pageName) {

  PageFinder.findPage(pageName, function(tabName, index) {

    if (tabName !== null && index !== null) {

      //sets the index
      tabBar.setIndex(tabName);
      var tabPath = "tabs/" + tabName;
      swipeViewIndex.currentIndex = index;

      Timer.setTimeout({
        task: () => {
          //navigates the desired page
          Router.go(tabPath)
        },
        delay: 2000
      });

    }
  });
}

function updateList() {
  var page = this;

  page.chatbotListview.itemCount = page.chatDatas.length;
  page.chatbotListview.refreshData();
  if (System.OS == "Android") {
    Timer.setTimeout({
      task: function() {
        page.chatbotListview.scrollTo(page.chatDatas.length - 1);
      },
      delay: 100
    });
  }
  else {
    page.chatbotListview.scrollTo(page.chatDatas.length - 1);
  }

}

function sizeOfLabel(text) {
  var sizeOfLabelObj = Font.create(Font.DEFAULT, 17, Font.NORMAL).sizeOfString(text, 250);

  return sizeOfLabelObj = { height: sizeOfLabelObj.height + 50, width: sizeOfLabelObj.width + 60 };
}

function initAlert() {

  var inforAlertView = new AlertView({
    title: "Ask For",
    message: 'Pages \n -Leave Management \n -Expense Management \n -Salary \n -Employment History \n -Employee Directory \n -Leaveapprovals \n -My Company \n Or Type for keywords as leave, approval etc.'
  });

  inforAlertView.addButton({
    index: AlertView.ButtonType.POSITIVE,
    text: "Okey",
    onClick: function() {
      console.log("Okey clicked.");
    }
  });

  return inforAlertView;
}


module && (module.exports = ChatbotPg);
