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
        dbData: {},
        aiData: {}
    })

    const[que, setQue] = useState('');
    const[ans, setAns] = useState('');

    const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
          {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
          },
        ],
      });



    const endRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({behavior: "smooth"})
    },[que, ans, img.dbData]);




    const add = async(text) => {
        setQue(text);

        const result = await chat.sendMessageStream(Object.entries(img.aiData).length ? [img.aiData, text] : [text]);
        let accumulatedText = '';
        for await (const chunk of result.stream){
            const chunkText = chunk.text();
            console.log(chunkText);
            accumulatedText += chunkText;4
            setAns(accumulatedText);
        }
       
        console.log(text);
        setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {}
        })
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