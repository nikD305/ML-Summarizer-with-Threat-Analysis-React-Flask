import React,  { useState } from 'react'
import './Comp.css'
import CircularProgress from '@mui/material/CircularProgress';
const Comp = () => {
    const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [summary, setSummary] = useState(null);
const [loading , setLoading] = useState(false)




  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: inputText })
      });
      const data = await response.json();
      setSummary(data.summary);
      setLoading(false)
      return data.summary
    } catch (error) {
      console.error(error);
    }
  };

  const handleTwo = async (responseData) => {
    setLoading(true)
    console.log(responseData.summary_text)
    try {
      const response = await fetch('http://localhost:5000/sentiment-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: responseData.summary_text })
      });
      const data = await response.json();
      console.log(data)
      setResult(data);
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  };

  const handleFunctions = async (event) => {
    event.preventDefault();
    const sum = await handleSubmit();
    console.log(sum)
    await handleTwo(sum);
  };

  return (
    <div  >
    <form onSubmit={handleFunctions}>
        <h1>Summarizer with Threat Analysis</h1>
        <div className="con" style={{display:"flex" , flexDirection:"row", justifyContent:"center",alignItems:"baseline"}}>
      <label>
       
        <input type="text"  value={inputText} onChange={handleInputChange} />
      </label>
      <button type="submit">Submit</button>
      </div>
    </form>
   {summary && (
      <div className='sum'>
        <p>Summary: {summary.summary_text}</p>
      </div>
    )} 
{
  loading && (
    <div className="loader">
<CircularProgress/>
    </div>
  )
}


  {result !== null && (
<div className={`result ${result.label === 'POSITIVE' ? 'positive' : 'negative'}`} >
    <p> { result.score.toString().slice(2,4)}% {result.label}  </p>
</div>
)}

  </div>
  )
}

export default Comp