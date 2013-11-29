test( "hello test", function() {
    ok( 1 == "1", "Passed!" );
});

test("number constant test", function() {
    var result = evalPuma("1");
    ok( result.success && 1 === result.value, "Passed!" );
});

test("string constant test", function() {
    var result = evalPuma("\"Hello\"");
    ok( result.success && "Hello" === result.value, "Passed!" );
});

test("test division", function(){
    var result = evalPuma("2 / 2;");
    equal( result.value, 1, "Passed!");
});

test("arithmetic operations", function(){
    var result = evalPuma("1 + 1 * 2 << 2 >> 2 / 2;");
    equal( result.value, 1 + 1 * 2 << 2 >> 2 / 2, "Passed!");
});

test("basic function", function(){
    var result = evalPuma("function foo(){ return 1; } foo();");
    equal( result.value, 1, "Passed!");
});

test("basic function arguments", function(){
    var result = evalPuma("function foo(a, b){ return a + b; } foo(1, 2);");
    equal( result.value, 3, "Passed!");
});

test("basic function arguments with same name than local variables", function(){
    var result = evalPuma("var a = 2; var b = 3; function foo(a, b){ return a + b; } foo(1, 2);");
    equal( result.value, 3, "Passed!");
});

test("parent variable hidden by local variable", function(){
    var result = evalPuma("var a = 1; function foo(){ var a = 5; return a; } foo();");
    result.makeValue();
    equal( result.value, 5, "Passed!");
});

test("local variable function do not alias parent scope function", function(){
    var result = evalPuma("var a = 1; function foo(){ var a = 5; return a; } foo(); a;");
    result.makeValue();
    equal( result.value, 1, "Passed!");
});

test("parent variable accessed from local function", function(){
    var result = evalPuma("var a = 1; function foo(){ a = 5; return 2; } foo(); a;");
    result.makeValue();
    equal( result.value, 5, "Passed!");
});

test("parent variable accessed from local function", function(){
    var result = evalPuma("var a = 1; var b = 1; function foo(){ var a = 2; function foo2(){ a = 5; } foo2(); b = a; return 2; } foo(); b;");
    result.makeValue();
    equal( result.value, 5, "Passed!");
});

test("recursive function call", function(){
    var result = evalPuma("function recursive(a){ if(a>5) return a; else return recursive(a+1); } recursive(1);");
    equal(result.value, 6, "Passed!");
});

test("function that returns a function", function(){
    var result = evalPuma("function foo(){ function inner(){ return 2; } return inner; } foo()();");
    equal(result.value, 2, "Passed!");
});

test("return statement", function(){
    var result = evalPuma("function foo(){ return 1; return 2; } foo();");
    equal( result.value, 1, "Passed!");
});

test("for statement 1", function(){
    var result = evalPuma("for(var i=0;i<2;i=i+1) { j+=1; }");
    equal( result.value, 2, "Passed!");
});

/*
test("for statement 2", function(){
    var result = evalPuma("var b=true; for(var i=0;b;i=i+1) { if(i>5)b=false; j+=1; }");
    equal( result.value, 2, "Passed!");
});
*/

test("meta variables types counting", function(){
    var meta = evalPuma("var a; a = 1; a = \"hola\"; a = 2;").value.meta;
    equal( meta["number"], 2, "Passed!");
    equal( meta["string"], 1, "Passed!");
});
