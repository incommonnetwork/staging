(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{"7wuJ":function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/home",function(){var e=n("CH2o");return{page:e.default||e}}])},CH2o:function(e,t,n){"use strict";n.r(t);var r=n("mXGw"),a=n.n(r),c=n("HMjY"),i=n("DomE"),o=n("MdJo");t.default=function(){return a.a.createElement(c.a,{redirect:"/sign_in"},a.a.createElement(i.a,null,a.a.createElement(o.a,null,"The Best interface is no interface... InCommon operated entirely by your email.")))}},HMjY:function(e,t,n){"use strict";var r=n("hDBU"),a=n("mXGw"),c=n.n(a),i=n("W0B4"),o=n.n(i),u=n("bBV7"),s=n("wOhW"),l=n("DomE"),d=n("vjOZ"),h=n("nKah"),p=n("Rbzu"),f=n("z3IF"),m=n("2Fjn"),b=n("8Jek"),w=n.n(b),v=n("2huS"),O=n("m0Sz"),j=function(e){var t=e.children,n=e.className,r=Object(m.a)(e,["children","className"]);return c.a.createElement(O.a,Object(f.a)({},r,{className:w()("box",n)}),t)};j.propTypes=Object(p.a)({},v.a.propTypes,{children:o.a.node,className:o.a.string,style:o.a.shape({}),renderAs:o.a.oneOfType([o.a.string,o.a.func])}),j.defaultProps=Object(p.a)({},v.a.defaultProps,{children:null,className:void 0,style:void 0,renderAs:"div"});var E=j,y=(n("DoJ4"),E),g=n("sLSl"),x=function(){return c.a.createElement(l.a,null,c.a.createElement(y,null,c.a.createElement(g.a,null)))},_=function(e){var t=e.children,n=e.router,a=e.role,i=e.redirect,o=Object(d.useMachine)(h.a.withContext({route:n.pathname,role:a,redirect:i})),u=Object(r.default)(o,1)[0];return c.a.createElement(s.a,null,u.matches("init")||u.matches("authorize")?c.a.createElement(x,null):t)};_.propTypes={children:o.a.oneOfType([o.a.arrayOf(o.a.node),o.a.node]),router:o.a.object.isRequired,role:o.a.string,redirect:o.a.string};t.a=Object(u.withRouter)(_)},nKah:function(e,t,n){"use strict";var r=n("UrUy"),a=n.n(r),c=n("R3/3"),i=n("ioJY"),o=n("8q3D"),u=n("TKeM");t.a=Object(i.Machine)({id:"protected",initial:"init",states:{init:{invoke:{id:"initAuth",src:function(){var e=Object(c.default)(a.a.mark(function e(){var t,n;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(o.a)();case 2:return t=e.sent,e.next=5,t.authenticate();case 5:return n=e.sent,e.abrupt("return",n);case 7:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),onDone:{target:"authorize",actions:Object(i.assign)({userId:function(e,t){return t.data.userId}})},onError:{actions:function(e){return u.a.push("".concat(e.redirect||"/sign_up","?redirect=").concat(e.route).concat(location.search?"&"+location.search.substr(1):""))}}}},authorize:{invoke:{id:"authorize",src:function(){var e=Object(c.default)(a.a.mark(function e(t){var n;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t.role){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,Object(o.a)();case 4:return n=e.sent,e.next=7,n.service("users").get(t.userId);case 7:if(-1!==e.sent.roles.split(",").indexOf(t.role)){e.next=10;break}throw new Error("unauthorized");case 10:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),onDone:{target:"signed_in"},onError:{actions:function(){return u.a.push("/home")}}}},signed_in:{on:{SIGN_OUT:{actions:function(){return u.a.push("/")}}}}}})}},[["7wuJ",1,0,2]]]);