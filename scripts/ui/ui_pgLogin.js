/* 
		WARNING 
		Auto generated file. 
		Do not modify its contents.
*/

const extend = require('js-base/core/extend');
const Page = require('sf-core/ui/page');
const Label = require('sf-core/ui/label');
const TextAlignment = require('sf-core/ui/textalignment');
const FlexLayout = require('sf-core/ui/flexlayout');
const Color = require('sf-core/ui/color');
const Button = require('sf-core/ui/button');

const TextboxWithLine = require("../components/TextboxWithLine");

const getCombinedStyle = require("library/styler-builder").getCombinedStyle;

const PgLogin_ = extend(Page)(
	//constructor
	function(_super, props) {
		// initalizes super class for this page scope
		_super(this, Object.assign({}, {
			onShow: onShow.bind(this),
			onLoad: onLoad.bind(this)
		}, props || {}));

		const appNameStyle = getCombinedStyle(".label .label-login.large .label-login", {
			text: "SELF SERVICE",
			textAlignment: TextAlignment.MIDCENTER,
			width: null,
			height: null,
			flexGrow: 5
		});
		var appName = new Label(appNameStyle);
		this.layout.addChild(appName);
		
		const inputLayoutStyle = getCombinedStyle(".flexLayout", {
			width: null,
			backgroundColor: Color.create(0, 255, 255, 255),
			height: null,
			justifyContent: FlexLayout.JustifyContent.CENTER,
			alignItems: FlexLayout.AlignItems.CENTER,
			flexGrow: 3
		});
		var inputLayout = new FlexLayout(inputLayoutStyle);
		this.layout.addChild(inputLayout);
		
		const buttonLayoutStyle = getCombinedStyle(".flexLayout", {
			width: null,
			height: null,
			backgroundColor: Color.create(0, 255, 255, 255),
			flexGrow: 3,
			alignItems: FlexLayout.AlignItems.CENTER,
			justifyContent: FlexLayout.JustifyContent.CENTER
		});
		var buttonLayout = new FlexLayout(buttonLayoutStyle);
		this.layout.addChild(buttonLayout);
		
		const bottomLayoutStyle = getCombinedStyle(".flexLayout", {
			width: null,
			height: null,
			backgroundColor: Color.create(0, 255, 255, 255),
			flexDirection: FlexLayout.FlexDirection.ROW,
			alignItems: FlexLayout.AlignItems.FLEX_END,
			justifyContent: FlexLayout.JustifyContent.CENTER,
			flexGrow: 1
		});
		var bottomLayout = new FlexLayout(bottomLayoutStyle);
		this.layout.addChild(bottomLayout);
		
		const usernameLayoutStyle = getCombinedStyle(".flexLayout", {
			height: 60,
			left: 0,
			top: 0,
			width: 250,
			backgroundColor: Color.create(0, 255, 255, 255),
			marginBottom: 5,
			positionType: FlexLayout.PositionType.RELATIVE
		});
		var usernameLayout = new TextboxWithLine(usernameLayoutStyle, "pgLogin");
		inputLayout.addChild(usernameLayout);
		this.usernameLayout = usernameLayout;

		const signinButtonStyle = getCombinedStyle(".button", {
			text: "SIGN IN",
			width: 250,
			height: 50,
			borderRadius: 25,
			borderColor: Color.create(255, 233, 233, 233),
			borderWidth: 1,
			backgroundColor: Color.create(0, 23, 117, 208)
		});
		var signinButton = new Button(signinButtonStyle);
		buttonLayout.addChild(signinButton);
		this.signinButton = signinButton;

		const dontHaveAccountStyle = getCombinedStyle(".label .label-login.small .label-login.info", {
			text: "Don't have an account yet?",
			width: null,
			height: 30,
			textAlignment: TextAlignment.MIDRIGHT,
			flexGrow: 10
		});
		var dontHaveAccount = new Label(dontHaveAccountStyle);
		bottomLayout.addChild(dontHaveAccount);
		
		const signupLabelStyle = getCombinedStyle(".label .label-login.small .label-login", {
			text: "Sign Up",
			width: null,
			height: 30,
			marginLeft: 5,
			flexGrow: 5
		});
		var signupLabel = new Label(signupLabelStyle);
		bottomLayout.addChild(signupLabel);
		this.signupLabel = signupLabel;

		const passwordLayoutStyle = getCombinedStyle(".flexLayout", {
			height: 60,
			left: 0,
			top: 0,
			width: 250,
			backgroundColor: Color.create(0, 255, 255, 255),
			marginTop: 5,
			positionType: FlexLayout.PositionType.RELATIVE
		});
		var passwordLayout = new TextboxWithLine(passwordLayoutStyle, "pgLogin");
		inputLayout.addChild(passwordLayout);
		this.passwordLayout = passwordLayout;

		//assign the children to page 
		this.children = Object.assign({}, {
			appName: appName,
			inputLayout: inputLayout,
			buttonLayout: buttonLayout,
			bottomLayout: bottomLayout
		});
		
		//assign the children of inputLayout
		inputLayout.children = Object.assign({}, {
			usernameLayout: usernameLayout,
			passwordLayout: passwordLayout
		});
		
		//assign the children of buttonLayout
		buttonLayout.children = Object.assign({}, {
			signinButton: signinButton
		});
		
		//assign the children of bottomLayout
		bottomLayout.children = Object.assign({}, {
			dontHaveAccount: dontHaveAccount,
			signupLabel: signupLabel
		});
		
	});

// Page.onShow -> This event is called when a page appears on the screen (everytime).
function onShow() {
  //StatusBar props
  const statusBarStyle = getCombinedStyle(".statusBar .statusBar-login", {});
	
	Object.assign(this.statusBar, statusBarStyle);
	
	if(statusBarStyle.color)
	  this.statusBar.android && (this.statusBar.android.color = statusBarStyle.color);
	if(statusBarStyle.style)
	  this.statusBar.ios && (this.statusBar.ios.style = statusBarStyle.style);

  //HeaderBar props
  const headerBarStyle = getCombinedStyle(".headerBar .headerBar-login", {
		title: "newPage001"
	});
	
	Object.assign(this.headerBar,	headerBarStyle);
	
}

// Page.onLoad -> This event is called once when page is created.
function onLoad() { 

  const pageStyle = getCombinedStyle(".page .page-login", {
		justifyContent: FlexLayout.JustifyContent.SPACE_AROUND,
		alignItems: FlexLayout.AlignItems.STRETCH
	});
	
	Object.assign(this.layout, pageStyle);
	
}

module && (module.exports = PgLogin_);