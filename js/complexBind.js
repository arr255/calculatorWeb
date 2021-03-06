/**
 * 
 * @param {int} number 按钮序号
 * @param {*string} cat 动作种类 
 * @param {*string} fun 执行函数
 * 
 * Examples: 
 *  bind(0,'tap','console.log("test")')
 *
 */
function bind(number,cat,fun) {
    Hammer(document.getElementsByClassName('button')[number]).on(cat,function(ev){
        eval(fun)
    });
}
bind(0,'tap','changePage({method:"shift"})');
bind(1,'tap','console.log("forward")');
bind(2,'tap','upButtonClick()');
bind(3,'tap','console.log("reply")');
bind(4,'tap','del()');
bind(5,'tap','clearContent()');
bind(6,'tap','moveLeft(1)');
bind(7,'tap','downButtonClick()');
bind(8,'tap','moveRight(1)');
bind(9,'tap','showHistory(0,"")');
bind(10,'tap','changeFormula("\\\\pi")');
bind(10,'press','changeFormula("\\\\mathrm{e}")');
bind(11,'tap','changeFormula("\\\\ln(")');
bind(11,'press','changeFormula("\\\\log(")');
bind(12,'tap','changeFormula("\\\\angle")');
bind(12,'press','changeFormula("\\\\arcsin(")');
bind(13,'tap','changeFormula("Arg(")');
bind(13,'press','changeFormula("\\\\arccos(")');
bind(14,'tap','changeFormula("\\\\Conj(")'); 
bind(14,'press','changeFormula("\\\\arctan(")');
bind(15,'tap','changeFormula("{\\\\color{pink}x}")');
bind(15,'press','changeFormula("^{-1}")');
bind(16,'tap','changeFormula("^{2}")');
bind(16,'press','changeFormula("^{3}")');
bind(17,'tap','changeFormula("\\\\sqrt[2]{\\\\underline{}}",{leftMove:2,cursorOnTheLine:true})')
bind(17,'press','changeFormula("\\\\sqrt[3]{\\\\underline{}}",{leftMove:2,cursorOnTheLine:true})')
bind(18,'tap','changeFormula("(")');
bind(19,'tap','changeFormula(")")');
bind(20,'tap','changeFormula(7)');
bind(20,'press','changeFormula("{\\\\color{pink}y}")');
bind(21,'tap','changeFormula(8)');
bind(21,'press','changeFormula("{\\\\color{pink}z}")');
bind(22,'tap','changeFormula(9)');
bind(22,'press','changeFormula("{\\\\color{pink}M}")');
bind(23,'tap','changeFormula("\\\\mathrm{\\\\times}")');
bind(23,'press','changeFormula("^{\\\\underline{}}",{leftMove:2})');
bind(24,'tap','changeFormula("\\\\mathrm{\\\\div}")');
bind(24,'press','addFrac()')
bind(25,'tap','changeFormula(4)');
bind(25,'press','changeFormula("{\\\\color{pink}F1")');
bind(26,'tap','changeFormula(5)');
bind(26,'press','changeFormula("{\\\\color{pink}F2")');
bind(27,'tap','changeFormula(6)');
bind(27,'press','changeFormula("{\\\\color{pink}F3")');
bind(28,'tap','changeFormula("\\\\mathrm{+}")');
bind(28,'press','changeFormula("C_{}^{}",{leftMove:4})');
bind(29,'tap','changeFormula("\\\\mathrm{-}")');
bind(29,'press','changeFormula("P_{}^{}",{leftMove:4})');
bind(30,'tap','changeFormula(1)');
bind(31,'tap','changeFormula(2)');
bind(32,'tap','changeFormula(3)');
bind(33,'tap','changeFormula("\\\\color{yellow}{i}")');
bind(33,'press','changeFormula("\\\\angle")');
bind(34,'tap','mainCalculate(currentFormula)');
bind(35,'tap','changeFormula(0)');
bind(35,'press','changeFormula("%")');
bind(36,'tap','changeFormula(".")');
bind(36,'press','changeFormula("\'")');
bind(37,'tap','changeFormula("E")');
bind(37,'press','changeFormula("\\\\mathrm{e}^{\\\\underline{}}",{leftMove:2})');
bind(39,'tap','changeFormula("\\\\color{green}=")')
bind(40,'tap','changeMode()');
bind(43,'tap','changePage({method:"LR"})');
//Page Two
bind(44,'tap','changePage({method:"shift"})');
bind(45,'tap','console.log("forward")');
bind(46,'tap','upButtonClick()');
bind(47,'tap','console.log("reply")');
bind(48,'tap','del()');
bind(49,'tap','clearContent()');
bind(50,'tap','moveLeft(1)');
bind(51,'tap','downButtonClick()');
bind(52,'tap','moveRight(1)');
bind(53,'tap','showHistory(0,"")');
bind(54,'press','changeFormula("\\\\pi")');
bind(54,'tap','changeFormula("\\\\mathrm{e}")');
bind(55,'press','changeFormula("\\\\ln(")');
bind(55,'tap','changeFormula("\\\\log(")');
bind(56,'press','changeFormula("\\\\sin(")');
bind(56,'tap','changeFormula("\\\\arcsin(")');
bind(57,'press','changeFormula("\\\\cos(")');
bind(57,'tap','changeFormula("\\\\arccos(")');
bind(58,'press','changeFormula("\\\\tan(")'); 
bind(58,'tap','changeFormula("\\\\arctan(")');
bind(59,'press','changeFormula("{\\\\color{pink}x}")');
bind(59,'tap','changeFormula("^{-1}")');
bind(60,'press','changeFormula("^{2}")');
bind(60,'tap','changeFormula("^{3}")');
bind(61,'press','changeFormula("\\\\sqrt[2]{\\\\underline{}}",{leftMove:2,cursorOnTheLine:true})')
bind(61,'tap','changeFormula("\\\\sqrt[3]{\\\\underline{}}",{leftMove:2,cursorOnTheLine:true})')
bind(62,'tap','changeFormula("(")');
bind(63,'tap','changeFormula(")")');
bind(64,'press','changeFormula(7)');
bind(64,'tap','changeFormula("{\\\\color{pink}y}")');
bind(65,'press','changeFormula(8)');
bind(65,'tap','changeFormula("{\\\\color{pink}z}")');
bind(66,'press','changeFormula(9)');
bind(66,'tap','changeFormula("{\\\\color{pink}M}")');
bind(67,'press','changeFormula("\\\\mathrm{\\\\times}")');
bind(67,'tap','changeFormula("^{\\\\underline{}}",{leftMove:2})');
bind(68,'press','changeFormula("\\\\mathrm{\\\\times}")');
bind(68,'tap','addFrac()')
bind(69,'press','changeFormula(4)');
bind(69,'tap','changeFormula("{\\\\color{pink}F1")');
bind(70,'press','changeFormula(5)');
bind(70,'tap','changeFormula("{\\\\color{pink}F2")');
bind(71,'press','changeFormula(6)');
bind(71,'tap','changeFormula("{\\\\color{pink}F3")');
bind(72,'press','changeFormula("\\\\mathrm{+}")');
bind(72,'tap','changeFormula("C_{}^{}",{leftMove:4})');
bind(73,'press','changeFormula("\\\\mathrm{-}")');
bind(73,'tap','changeFormula("P_{}^{}",{leftMove:4})');
bind(74,'press','changeFormula(1)');
bind(75,'press','changeFormula(2)');
bind(76,'press','changeFormula(3)');
bind(77,'press','changeFormula("Res")');
bind(77,'tap','changeFormula("\\\\color{pink}M")');
bind(78,'press','mainCalculate(currentFormula)');
bind(79,'press','changeFormula(0)');
bind(79,'tap','changeFormula("%")');
bind(80,'press','changeFormula(".")');
bind(80,'tap','changeFormula("\'")');
bind(81,'press','changeFormula("E")');
bind(81,'tap','changeFormula("\\\\mathrm{e}^{\\\\underline{}}",{leftMove:2})');
bind(83,'tap','changeFormula("\\\\color{green}=")')
bind(84,'tap','changeMode()');
bind(87,'tap','changePage({method:"LR"})');

//Page Three

bind(88,'tap','changePage({method:"shift"})');
bind(89,'tap','changeDegMode()');
bind(91,'tap','window.location.href="plot.html"');
bind(92,'tap','plotBtn()')
bind(93,'tap','changeFormula("P_{}^{}",{leftMove:4})');
bind(94,'tap','changeFormula("C_{}^{}",{leftMove:4})');
bind(98,'tap','changeFormula("\\\\sqrt[3]{\\\\underline{}}",{leftMove:2})');
bind(99,'tap','changeFormula("\\\\sqrt[\\\\underline{}]{}",{leftMove:4,cursorOnTheLine:true})');
bind(100,'tap','changeFormula("\\\\sin(")');
bind(100,'press','changeFormula("\\\\arcsin(")');
bind(101,'tap','changeFormula("\\\\cos(")');
bind(101,'press','changeFormula("\\\\arccos(")');
bind(102,'tap','changeFormula("\\\\tan(")'); 
bind(102,'press','changeFormula("\\\\arctan(")');
bind(103,'tap','changeFormula("^{3}")');
bind(104,'tap','changeFormula("^{\\\\underline{}}",{leftMove:2})');
bind(105,'tap','changeFormula("\\\\sinh(")');
bind(105,'press','changeFormula("\\\\arcsinh(")');
bind(106,'tap','changeFormula("\\\\cosh(")');
bind(106,'press','changeFormula("\\\\arccosh(")');
bind(107,'tap','changeFormula("\\\\tanh(")'); 
bind(107,'press','changeFormula("\\\\arctanh(")');
bind(108,'tap','changeFormula("\\\\color{pink}r")');
bind(109,'tap','changeFormula("\\\\color{pink}\\\\theta")');
bind(110,'tap','changeFormula("\\\\equiv")');
bind(111,'tap','changeFormula("GCD(,)",{leftMove:2})');
bind(112,'tap','changeFormula("LCM(,)",{leftMove:2})');
bind(113,'tap','changeFormula("!")');
bind(114,'tap','changeFormula("\\\\mathrm{e}^{\\\\underline{}}",{leftMove:2})');
bind(115,'tap','changeFormula("\\\\log(")');
bind(116,'tap','changeFormula("\\\\int_{\\\\underline{}}^{}dx",{leftMove:7})');
bind(117,'tap','changeFormula("\\\\delta(,)",{leftMove:2})');
bind(118,'tap','changeFormula("^{-1})');
bind(119,'tap','changeFormula("\\\\mathrm{e}")');
bind(120,'tap','changeFormula("\\\\log_{}()",{leftMove:3})');
bind(121,'tap','changeFormula("\\\\sum_{\\\\color{pink}x=}^{}()",{leftMove:6})');
bind(122,'tap','changeFormula("\\\\prod_{\\\\color{pink}x=}^{}()",{leftMove:6})');
bind(123,'tap','changeFormula("\\\\mathrm{d}")');
bind(124,'tap','changeFormula("^{\\\\circ}")');
bind(125,'tap','changeFormula("NPr(")');
bind(126,'tap','changeFormula("\\\\mid{}\\\\mid",{leftMove:5})');
bind(127,'tap','changeFormula(",")');
bind(128,'tap','changeMode()');
bind(131,'tap','changePage({method:"LR"})');

//page four

bind(132,'tap','changePage({method:"shift"})');
bind(133,'tap','changeDegMode()');
bind(135,'tap','window.location.href="plot.html"');
bind(137,'tap','changeFormula("P_{}^{}",{leftMove:4})');
bind(138,'tap','changeFormula("C_{}^{}",{leftMove:4})');
bind(142,'tap','changeFormula("\\\\sqrt[3]{\\\\underline{}}",{leftMove:2})');
bind(143,'tap','changeFormula("\\\\sqrt[\\\\underline{}]{}",{leftMove:4,cursorOnTheLine:true})');
bind(144,'press','changeFormula("\\\\sin(")');
bind(144,'tap','changeFormula("\\\\arcsin(")');
bind(145,'press','changeFormula("\\\\cos(")');
bind(145,'tap','changeFormula("\\\\arccos(")');
bind(146,'press','changeFormula("\\\\tan(")'); 
bind(146,'tap','changeFormula("\\\\arctan(")');
bind(147,'tap','changeFormula("^{3}")');
bind(148,'tap','changeFormula("^{\\\\underline{}}",{leftMove:2})');
bind(149,'press','changeFormula("\\\\sinh(")');
bind(149,'tap','changeFormula("\\\\arcsinh(")');
bind(150,'perss','changeFormula("\\\\cosh(")');
bind(150,'tap','changeFormula("\\\\arccosh(")');
bind(151,'press','changeFormula("\\\\tanh(")'); 
bind(151,'tap','changeFormula("\\\\arctanh(")');
bind(152,'tap','changeFormula("\\\\color{pink}r")');
bind(153,'tap','changeFormula("\\\\color{pink}\\\\theta")');
bind(154,'tap','changeFormula("\\\\equiv")');
bind(155,'tap','changeFormula("GCD(,)",{leftMove:2})');
bind(156,'tap','changeFormula("LCM(,)",{leftMove:2})');
bind(157,'tap','changeFormula("!")');
bind(158,'tap','changeFormula("\\\\mathrm{e}^{\\\\underline{}}",{leftMove:2})');
bind(159,'tap','changeFormula("\\\\log(")');
bind(160,'tap','changeFormula("\\\\int_{\\\\underline{}}^{}dx",leftMove:7)');
bind(161,'tap','changeFormula("\\\\delta(,)",{leftMove:2})');
bind(162,'tap','changeFormula("^{-1})');
bind(163,'tap','changeFormula("\\\\mathrm{e}")');
bind(164,'tap','changeFormula("\\\\log_{}()",{leftMove:3})');
bind(165,'tap','changeFormula("\\\\sum_{\\\\color{pink}x=}^{}()",{leftMove:6})');
bind(166,'tap','changeFormula("\\\\prod_{\\\\color{pink}x=}^{}()",{leftMove:6})');
bind(167,'tap','changeFormula("\\\\mathrm{d}")');
bind(168,'tap','changeFormula("^{\\\\circ}")');
bind(169,'tap','changeFormula("NPr(")');
bind(170,'tap','changeFormula("\\\\mid{}\\\\mid",{leftMove:5})');
bind(171,'tap','changeFormula("changeFormula(",")")');
bind(172,'tap','changeMode()');
bind(175,'tap','changePage({method:"LR"})');
