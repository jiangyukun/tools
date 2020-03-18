
function b() {
    var age = 123
    console.log('bbb');
}

export async function a() {
    console.log('aaa');
    await b()
}
