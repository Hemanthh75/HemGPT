import React, { useEffect, useRef, useState } from "react";
import "./newPrompt.css"
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from 'react-markdown';

const NewPromt = () => {


    const[img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {}
    })

    const[que, setQue] = useState('');
    const[ans, setAns] = useState('');



    const endRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({behavior: "smooth"})
    },[que, ans, img.dbData]);




    const add = async(text) => {
        setQue(text);

        const result = await model.generateContent(text);
        const response = await result.response;
        setAns(response.text());
        console.log(text)
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        const text = e.target.text.value;
        if(!text) return;

        add(text);
    }

    return (
        <> 
        {/*ADDED NEW CHAT*/}
        {img.isLoading && <div className="">Loading...</div>}
        {img.dbData?.filePath && (
             <IKImage
             urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT} 
             path={img.dbData?.filePath}
             width="380"
             transformation={[{width: 380}]}
           />
        )}
        {que && <div className="message user">{que}</div>}
        {ans && <div className="message"><Markdown>{ans}</Markdown></div>}
         <div className="endChat" ref={endRef}></div>
            <form className="newForm" onSubmit={handleSubmit}>
                <Upload setImg={setImg}/>
                <input id="file" type="file" multiple={false} hidden />
                <input type="text" name="text" placeholder="Ask anything..." />
                <button>
                    <img src="/arrow.png" alt="" />
                </button>
            </form>
        </>
    )
}

export default NewPromt;