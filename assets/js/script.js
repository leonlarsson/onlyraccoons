async function fetchImage() {

    // const sources = ["https://www.reddit.com/r/trashpandas/top/.json?sort=top&t=month&limit=100", "https://www.reddit.com/r/raccoons/hot.json?limit=100"] // Could make this more efficient

    await fetch("https://www.reddit.com/r/trashpandas/top/.json?sort=top&t=month&limit=100") // Fetch posts
        .then(response => response.json())
        .then(response => {
            json0 = response;
        });

    await fetch("https://www.reddit.com/r/raccoons/hot.json?limit=100") // Fetch posts
        .then(response => response.json())
        .then(response => {
            json1 = response;
        });

    loadImage();
}

function loadImage() {

    const source = Math.floor(Math.random() * 2); // Gets 0 or 1
    const response = window[`json${source}`]; // json0 or json1


    document.getElementById("text").style.display = "none";
    document.getElementById("vidText").style.display = "none";
    const child = Math.floor(Math.random() * 100);
    const images = ["i.redd.it", ".jpg", ".png", "jpeg"];
    const videos = ["v.redd.it"];
    const youtube = ["youtube", "youtu.be"];
    const gfycat = ["gfycat"];
    const gifv = [".gifv"];


    try {
        if (!response) return;
        const subreddit = response.data.children[child].data.subreddit;
        const linkID = response.data.children[child].data.id;
        const imgUrl = response.data.children[child].data.url; // Gets post URL

        if (images.some(i => imgUrl.includes(i))) { // If post is image
            console.log(`----------------------------------------\n[DEBUG] Found image: ${imgUrl} from https://reddit.com/${linkID} (r/${subreddit})\n[DEBUG] Post number: ${child}\n----------------------------------------`);

            document.getElementById("video").setAttribute("src", " ");
            document.getElementById("youtube").setAttribute("src", " ");
            document.getElementById("image").setAttribute("src", imgUrl);
            document.getElementById("image").style.display = "block";
            document.getElementById("video").style.display = "none";
            document.getElementById("youtube").style.display = "none";

        } else if (videos.some(i => imgUrl.includes(i))) { // If post is video
            if (response.data.children[child].data.hasOwnProperty("crosspost_parent")) {
                subredditCrosspost = response.data.children[child].data.crosspost_parent_list[0].subreddit;
                console.log(`----------------------------------------\n[DEBUG] Found video: ${imgUrl} from https://reddit.com/${linkID} (r/${subreddit} from r/${subredditCrosspost})\n[DEBUG] Post number: ${child}\n----------------------------------------`);
                const videoURL = response.data.children[child].data.crosspost_parent_list[0].media.reddit_video.fallback_url;
                document.getElementById("video").setAttribute("src", videoURL);
            } else {
                console.log(`----------------------------------------\n[DEBUG] Found video: ${imgUrl} from https://reddit.com/${linkID} (r/${subreddit})\n[DEBUG] Post number: ${child}\n----------------------------------------`);
                const videoURL = response.data.children[child].data.media.reddit_video.fallback_url;
                document.getElementById("video").setAttribute("src", videoURL);
            }
            document.getElementById("vidText").style.display = "block";
            document.getElementById("image").setAttribute("src", " ");
            document.getElementById("youtube").setAttribute("src", " ");
            document.getElementById("video").style.display = "block";
            document.getElementById("image").style.display = "none";
            document.getElementById("youtube").style.display = "none";
            document.getElementById("video").play();
            return;

        } else if (youtube.some(i => imgUrl.includes(i))) { // If post is youtube video
            console.log(`----------------------------------------\n[DEBUG] Found YouTube: ${imgUrl} from https://reddit.com/${linkID} (r/${subreddit})\n[DEBUG] Post number: ${child}\n----------------------------------------`);
            const newStr = response.data.children[child].data.secure_media.oembed.thumbnail_url.slice(23, -14);
            const youtubeUrl = `https://www.youtube.com/embed/${newStr}?autoplay=1&mute=1&feature=oembed&enablejsapi=1`;

            document.getElementById("youtube").setAttribute("src", youtubeUrl);
            document.getElementById("youtube").style.display = "block";
            document.getElementById("video").setAttribute("src", " ");
            document.getElementById("image").setAttribute("src", " ");
            document.getElementById("image").style.display = "none";
            document.getElementById("video").style.display = "none";
            return;

        } else if (gfycat.some(i => imgUrl.includes(i))) { // If post is gfycat
            console.log(`----------------------------------------\n[DEBUG] Found gfycat: ${imgUrl} from https://reddit.com/${linkID} (r/${subreddit})\n[DEBUG] Post number: ${child}\n----------------------------------------`);
            const newStr = response.data.children[child].data.secure_media.oembed.thumbnail_url.slice(26, -20); // Get the gif name with the correct capitalizations
            const gfycatUrl = `https://giant.gfycat.com/${newStr}.mp4` // Build the Gfycat mp4 url

            document.getElementById("image").setAttribute("src", " ");
            document.getElementById("youtube").setAttribute("src", " ");
            document.getElementById("video").setAttribute("src", gfycatUrl);
            document.getElementById("video").style.display = "block";
            document.getElementById("image").style.display = "none";
            document.getElementById("youtube").style.display = "none";
            document.getElementById("video").play();
            return;
        } else if (gifv.some(i => imgUrl.includes(i))) { // If post is gifv
            console.log(`----------------------------------------\n[DEBUG] Found gifv: ${imgUrl} from https://reddit.com/${linkID} (r/${subreddit})\n[DEBUG] Post number: ${child}\n----------------------------------------`);
            const newStr = response.data.children[child].data.url.slice(0, -5); // remove ".gif"
            const gifvUrl = `${newStr}.mp4`; // Build the gifv mp4 url

            document.getElementById("image").setAttribute("src", " ");
            document.getElementById("youtube").setAttribute("src", " ");
            document.getElementById("video").setAttribute("src", gifvUrl);
            document.getElementById("video").style.display = "block";
            document.getElementById("image").style.display = "none";
            document.getElementById("youtube").style.display = "none";
            document.getElementById("video").play();
            return;

        } else {
            console.log(`----------------------------------------\n[DEBUG] Found unrecognized format (re-running): ${imgUrl} from https://reddit.com/${linkID} (r/${subreddit})\n[DEBUG] Post number: ${child}\n----------------------------------------`);
            loadImage();
        }

    } catch (e) {
        document.getElementById("vidText").style.display = "none";
        console.log(`%c[DEBUG] (${source}, ${child}) Something went wrong or I found a crosspost. Re-running.\n\n[ERROR] ${e}`, "color: #dc5b4a");
        loadImage();
    }
}