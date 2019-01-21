var p1 = new Promise(
    (resolve, reject) => {
        console.log("프라미스 함수제작");
        // 0.5초 뒤에 콘솔에 찍습니다.
        setTimeout(
            () => {
                // 프라미스 이행 될때 실행할 부분을 resolve로 적습니다.
                resolve({ p1 : "^_^"});
        }, 500);

    }
);

var p2 = new Promise(
    (resolve, reject) => {
        console.log("프라미스 함수제작");
        // 0.3초 뒤에 콘솔에 찍습니다.
        setTimeout(
            function() {
                resolve({ p2 : "-_-" });
            }, 300 );
    }
);

// p1.then( (result) => {
//     console.log(result.p1);
// })

// Promise.all([p1, p2]).then( (result) => {
//     console.log(result);
//     console.log("p1 = " + result[0].p1);
//     console.log("p2 = " + result[1].p2);
// });

// p1.then( result => {
//     console.log("p1 = " + result.p1);
//     return p2;
// }).then( result => {
//     console.log("p2 = " + result.p2);
// });

async function asyncCall() {

    var p1_value = await p1;
    console.log(p1_value);

    var p2_value = await p2;
    console.log(p2_value);
}

asyncCall();