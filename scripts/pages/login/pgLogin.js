/*global lang*/
const extend = require("js-base/core/extend");
const Animator = require("sf-core/ui/animator");
const Image = require("sf-core/ui/image");
const Router = require("sf-core/router");
const System = require("sf-core/device/system");
const Timer = require("sf-core/timer");
const fingerprint = require("sf-extension-utils").fingerprint;
const rau = require("sf-extension-utils").rau;
const mcs = require("../../lib/mcs");
const ActionKeyType = require('sf-core/ui/actionkeytype');

const PageDesign = require("../../ui/ui_pgLogin");

const Page_ = extend(PageDesign)(
	// Constructor
	function(_super, params) {
		// Initalizes super class for this page scope
		_super(this, params);
		this.onLoad = onLoad.bind(this, this.onLoad);
		this.onShow = onShow.bind(this, this.onShow);


	}
);

function onLoad(parentOnLoad) {
	parentOnLoad && parentOnLoad();
	const page = this;
	const signInAction = signin.bind(this.signinButton, this);
	page.usernameLayout.onActionButtonPress = function() {
		page.passwordLayout.requestFocus();
	};
	page.usernameLayout.actionKeyType = ActionKeyType.NEXT;

	page.passwordLayout.onActionButtonPress = function() {
		signInAction();
	};
	page.passwordLayout.actionKeyType = ActionKeyType.SEND;

	this.signinButton.onPress = signInAction;

	page.appName.onTouchEnded = function() {
		page.usernameLayout.innerTextbox.text = "selfservice";
		page.passwordLayout.innerTextbox.text = "123qweASD";
	};
}

function onShow(parentOnShow, params) {
	parentOnShow && parentOnShow(params);
	const page = this;

	this.usernameLayout.innerTextbox.ios.clearButtonEnabled = true;
	this.passwordLayout.innerTextbox.ios.clearButtonEnabled = true;
	// Reset sign in button status because if sign in animation ran it changes

	this.signinButton.width = 250;
	this.signinButton.alpha = 1;
	this.loadingImageView.alpha = 0;

	initTexts(this);

	fingerprint.init({
		userNameTextBox: this.usernameLayout.innerTextbox,
		passwordTextBox: this.passwordLayout.innerTextbox,
		autoLogin: true,
		callback: function(err, fingerprintResult) {
			var password;
			if (err)
				password = page.passwordLayout.innerTextbox.text;
			else
				password = fingerprintResult.password;
			if (!password)
				return alert("password is required");

			doLogin(page, page.usernameLayout.innerTextbox.text, password, function(err) {
				if (err)
					return;
				fingerprintResult && fingerprintResult.success(); //Important!
				startLoading(page);
			});

		}
	});

	rau.checkUpdate({
		url: "https://smf.to/selfservice"
	});
}


// Loads texts from language file
function initTexts(page) {
	page.passwordLayout.innerTextbox.isPassword = true;
	// button properties
	page.signinButton.text = lang["pgLogin.signin"];
	page.appName.text = lang["pgLogin.appName"];

	page.usernameLayout.textboxInfo.text = lang["pgLogin.inputs.username.info"];
	page.passwordLayout.textboxInfo.text = lang["pgLogin.inputs.password.info"];

	page.passwordLayout.innerTextbox.text = "";
}

// Runs sign in animation and calls sign in service
function signin(page) {
	if (page.usernameLayout.innerTextbox.text === "") {
		alert(lang["pgLogin.inputs.username.error"]);
		return;
	}
	fingerprint.loginWithFingerprint();
}

function doLogin(page, username, password, callback) {
	mcs.login({
		username: username,
		password: password
	}, function(err, userData) {
		if (err) {
			return alert("Username & password not accepted"); //TODO: lang
		}
		callback && callback();
	});

}

function startLoading(uiComponents) {
	var imageView = uiComponents.loadingImageView;

	uiComponents.signinButton.text = "";

	var layout;
	if (System.OS == 'Android') {
		layout = uiComponents.buttonLayout;
	}
	else {
		layout = uiComponents.layout;
	}

	Animator.animate(layout, 100, function() {
		uiComponents.signinButton.width = 50;
		uiComponents.signinButton.alpha = 0.2;
	}).complete(function() {
		uiComponents.signinButton.alpha = 0;
		rotateImage(imageView, uiComponents);
		Animator.animate(uiComponents.layout, 300, function() {
			imageView.alpha = 1;
		});
	});

	function rotateImage(imageView, page, onFinish) {
		var image;
		if (System.OS == "Android") {
			const AndroidUnitConverter = require('sf-core/util/Android/unitconverter');
			var pixel = AndroidUnitConverter.dpToPixel(50);
			image = Image.createFromFile("images://loading.png").resize(pixel, pixel);
		}
		else {
			image = Image.createFromFile("images://loading.png").resize(50, 50);
		}
		var counter = 0;
		var timer = Timer.setInterval({
			task: function() {
				imageView.image = image.rotate(++counter * 7);

				if (counter > 100) {
					Timer.clearTimer(timer);
					Router.go("tabs");
				}
			},
			delay: (1000 / 60)
		});
	}
}

module && (module.exports = Page_);
