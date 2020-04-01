(function(){
    const user = (
        window.location.search && window.location.search.split("?username=")[1] !== ""
        ? window.location.search.split("?username=")[1]
            : document.cookie && document.cookie.split("username=")[1] !== ""
            ? document.cookie.split("username=")[1]
            : "!!null"
    );

    fetch("/profile/"+user)
        .then(response => Promise.all([response.ok, response.ok ? response.json() : response.text(), response.headers]))
        .then(([ok, body, headers]) => {
            if(ok) {
                getThumbnail();

                $(".userh2").innerHTML = body.username;
                $("#profiledesc h3").innerHTML = `${body.firstname} ${body.lastname.charAt(0)}`;

                if (headers.get("isUser") === "true") {
                    $(".actionbutton.upload").style.display = "inline-block";
                    $(".actionbutton.settings").style.display = "inline-block";
                } else {
                    $(".actionbutton.follow").style.display = "inline-block";
                    $("#tnoverlay").remove();
                    //$(".actionbutton.following").style.display = "inline-block";
                }
            }else{
                let mw = $("#mainwrapper");
                while(mw.lastChild){
                    mw.removeChild(mw.lastChild);
                }
                let h1 = document.createElement("h1");
                h1.innerHTML = body;
                h1.className = "posabs";
                document.body.appendChild(h1);
            }
        });


    const getThumbnail = () => {
        fetch("/getThumbnail/" + user).then(response => response.blob()).then(blob => {
            if (blob.size !== 0) {
                $(".emptytn").remove();
                $(".userimg").style.backgroundImage = `url(${URL.createObjectURL(blob)})`
            }
        }).catch(error => {
            console.log(error)
        });
    };

    $("#thumbnail").addEventListener("change", function(){
        let formdata = new FormData();
        let file = $("#thumbnail").files[0];
        formdata.append("file", file);
        fetch("/uploadThumbnail", {method: "POST", body: formdata}).then(response => response.blob()).then(blob => {
            $(".userimg").style.backgroundImage = `url(${URL.createObjectURL(blob)})`
            $(".emptytn").remove();
        }).catch(error => {console.log(error)});
    });

    createHeader();
})();

