const contentLetterSrart_actived = `HAPPY BIRTHDAY EM 🎂🥳
Chúc em yêu của anh tuổi mới luôn vui vẻ 😊, lạc quan và yêu đời 😍😎✨. 
Mong em luôn đạt được những điều em mơ ước, mong muốn 💕💖🌟.
Chúc em sớm đạt được những dự định trong tương lai 🚀🎯. 
Và anh mong trong khoảng thời gian đó anh sẽ luôn đồng hành cùng em 👫💕.
Mong cho tuổi mới em sẽ yêu anh nhiều hơn 🥰, yêu anh lâu hơn nha 😘💞. 
Anh biết mỗi ngày em sẽ phải rất mệt mỏi 😢💤.
Nhưng em đừng chịu đựng một mình nhé 🙉🙈🙊. 
Anh vẫn sẽ luôn lắng nghe 👂 và trò chuyện cùng em 💬🫂.
Anh yêu em nhiều lắm aa 😋❤️‍🔥. 
Chúc em có 1 ngày sinh nhật thật vui vẻ nha 🎉🎈🥰🙈🙊.`;

let imgStart = document.querySelector(".myAI");
imgStart.src = "./img/cute-young-boy-kid-wearing-vest-and-hat-free-png.png";

let imgLetter = document.querySelector(".img");
imgLetter.src = "./img/b4bbdb54b7152338d7143cb444a77f09.png";

const splitContentLetterSrart_actived = contentLetterSrart_actived.split("");

document.querySelector(".sticker").addEventListener("click", function () {
    document.querySelector(".contentLetter").innerHTML = "";
    document.querySelector(".startLetter").classList.add("active")
    setTimeout(() => {
        splitContentLetterSrart_actived.forEach((val, index) => {
            setTimeout(() => {
                // Thay \n bằng <br> để xuống dòng đúng trong HTML
                document.querySelector(".contentLetter").innerHTML += val === '\n' ? '<br>' : val;

                if (index === contentLetterSrart_actived.length - 1) {
                    setTimeout(() => {
                        document.querySelector(".recieve").setAttribute("style", "opacity: 1; transition: .5s");
                    }, 1000)
                }
            }, 50 * index);
        });
    }, 1000);
});

document.querySelector("#mess").addEventListener("change", function () {
    if (this.checked == true) {
        document.querySelector(".content").classList.add("actived")
        const splitMainContentLetter = mainContentLetter.split("");

        splitMainContentLetter.forEach((val, index) => {
            setTimeout(() => {
                document.querySelector(".mainContent").innerHTML += val === '\n' ? '<br>' : val;
                if (index == mainContentLetter.length - 1) {
                    document.querySelector(".img1").setAttribute("style", "opacity: 1; transition: .5s")
                }
            }, 50 * index)
        })

    } else {
        document.querySelector(".content").classList.remove("actived")
        document.querySelector(".img1").setAttribute("style", "opacity: 0; transition: .5s")
        document.querySelector(".mainContent").innerHTML = "";
    }
});

document.querySelector(".recieve").addEventListener("click", () => {
    document.querySelector(".startLetter").classList.add("close");
    setTimeout(() => {
        document.querySelector(".startForm").classList.add("close");
        setTimeout(() => {
            document.querySelector(".startForm").setAttribute("style", "bottom: 100%");
            
            let getTypeDevice = document.documentElement.clientWidth;
            if (getTypeDevice <= 768) {
                createLight(20)
            } else {
                createLight(40)
            }

        }, 500)
    }, 500)
});

const getBackground = document.querySelector(".backgroundParty");
var width = getBackground.offsetWidth;
var height = getBackground.offsetHeight;

function createLight(a) {
    var container = document.querySelector(".backgroundParty");
    const blurLv = [2, 4];
    const count = a;
    const allDefaultColor = ["red", "lime", "yellow", "orange", "blue"]

    for (var i = 0; i < count; i++) {
        var randomLeft = Math.floor(Math.random() * width);
        var randomTop = Math.floor(Math.random() * height / 2);
        var color = "white";
        var blur = Math.floor(Math.random() * 2);
        var widthEle = Math.floor(Math.random() * 5) + 15;
        var moveTime = Math.floor(Math.random() * 4) + 4;

        var div = document.createElement("div");
        div.className = "snow"; // ← sửa lỗi: classList.add = "snow" là sai
        div.style.position = "absolute";
        div.style.backgroundColor = allDefaultColor[Math.floor(Math.random() * 5)]
        div.style.borderRadius = Math.floor(Math.random() * 10 + 10).toString() + "px"

        div.style.height = widthEle * Math.floor(Math.random() * 4 + 1) + "px";
        div.style.width = widthEle + "px";
        div.style.marginLeft = randomLeft + "px"
        div.style.marginTop = randomTop + "px"
        div.style.filter = "blur(" + blurLv[blur] + "px" + ")"
        div.style.animation = "moveLight " + moveTime + "s ease-in-out infinite";

        container.appendChild(div);
    }
}
