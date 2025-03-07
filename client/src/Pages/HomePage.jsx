import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";
import Navbar from "../MyComponents/Navbar";
import JobCard from "../MyComponents/JobCard";
import Footer from "../MyComponents/Footer";
import axios from "axios";
import { useBackEndApi } from "../Contexts/BackEndApi";
import "../assets/HomePage.css";
import { useEffect, useRef, useState } from "react";
import { useJobs } from "../Contexts/Jobs";
import {  replace, useNavigate } from "react-router-dom";



export default function HomePage() {

  const navigate = useNavigate();

  const jobPageNumber = useRef(0);
  const lastJobPageNumber = useRef(null);
  const searchPageNumber = useRef(0);
  const categoryPageNumber = useRef(0);
  
  const [currentCategory, setCurrentCategory] = useState("");
  const [oldCategory, setOldCategory] = useState("");
  const [allJobRetrieved, setAllJobRetrieved] = useState(false);
  const [allCategoryRetrieved, setAllCategoryRetrieved] = useState(false);
  const [categoryFlag, setCategoryFlag] = useState(false);
  const [searchFlag, setSearchFlag] = useState(false);
  const [allResultRetrieved, setAllResultRetrieved] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [oldSearchData, setOldSearchData] = useState("");
  const [notFoundFlag, setNotFoundFlag] = useState(false);
  const [categoriesNotFoundFlag, setCategoriesNotFoundFlag] = useState(false);
  
  const backEndApi = useBackEndApi();
  
  const [searchResult, setSearchResult] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  const { jobs, setJobs } = useJobs([]);
  const [isFetching, setIsFetching] = useState(false);
  
  useEffect(() => {
    return () => {
      setJobs([]);
      setCategories([]);
      setSearchResult([]);
      setCategory([]);
    };
  }, []);
  
  const getCategories = async () => {
    try {
      const response = await axios.get(`${backEndApi}/jobs/categories`);
      if (response.data.allCategories) {
        setCategories(response.data.allCategories);
      } else {
        setCategoriesNotFoundFlag(true);
      }
    } catch (error) {
      console.error("Error While getting categories", error);
    }
  };
  
  const getJobs = async () => {
    setCurrentCategory("");
    if (isFetching || allJobRetrieved) return;
    setIsFetching(true);
  
    const toastId = toast.loading("Fetching jobs...");
  
    try {
      setNotFoundFlag(false);
      setAllJobRetrieved(false);
  
      if (searchFlag || categoryFlag) {
        jobPageNumber.current = 1;
        lastJobPageNumber.current = null;
        setCategoryFlag(false);
        setSearchFlag(false);
      } else {
        jobPageNumber.current++;
      }
  
      if (jobPageNumber.current === lastJobPageNumber.current) {
        toast.dismiss(toastId);
        setIsFetching(false);
        return;
      }
  
      const response = await axios.get(`${backEndApi}/jobs/`, {
        params: { page: jobPageNumber.current },
      });
  
      if (response.data.jobList.length > 0) {
        setJobs((prevJobs) => {
          const jobMap = new Map();
  
          prevJobs.forEach((job) => jobMap.set(job._id, job));
  
          response.data.jobList.forEach((job) => jobMap.set(job._id, job));
  
          return Array.from(jobMap.values()); 
        });
  
        lastJobPageNumber.current = jobPageNumber.current;
      } else if (response.data.totalJobs === 0) {
        setNotFoundFlag(true);
        setJobs([]);
        toast.info("No jobs found.");
      }
  
      if (response.data.allJobRetrieved) {
        setAllJobRetrieved(true);
      }
    } catch (error) {
      setTimeout(() => {
        navigate("/server_error", replace)
      }, 1000);
      console.error("Error fetching jobs", error);
      toast.error("Failed to fetch jobs. Server-side error...");
    } finally {
      toast.dismiss(toastId);
      setIsFetching(false);
    }
  };
   
  
  const getCategory = async (incomingCategory) => {
    try {
      setNotFoundFlag(false);
      setAllCategoryRetrieved(false);
  
      if (oldCategory === "") {
        setOldCategory(incomingCategory);
      }
      setCurrentCategory(incomingCategory);
  
      if (oldCategory !== incomingCategory) {
        categoryPageNumber.current = 0;
      }
  
      categoryPageNumber.current++;
  
      const response = await axios.get(`${backEndApi}/jobs/category`, {
        params: { page: categoryPageNumber.current, category: incomingCategory },
      });
  
      if (response.data.categoryList.length > 0) {
        setCategory((prevCategory) => {
          const categoryMap = new Map();
          
          prevCategory.forEach((cat) => categoryMap.set(cat._id, cat)); 
          response.data.categoryList.forEach((cat) => categoryMap.set(cat._id, cat));
  
          return Array.from(categoryMap.values()); 
        });
  
        setOldCategory(incomingCategory);
      }
  
      if (response.data.totalCountOfThisCategory === 0 && response.data.allCategoryRetrieved) {
        setNotFoundFlag(true);
        setCategory([]);
      }
  
      if (response.data.allCategoryRetrieved) {
        setAllCategoryRetrieved(true);
      }
  
      setCategoryFlag(true);
      setSearchFlag(false);
      setSearchResult([]);
      setJobs([]);
      setSearchData("");
    } catch (error) {
      console.error("Error While getting category", error);
    }
  };
    
  const handleSearch = async (currentSearchData) => {
    setCurrentCategory("");
    if (currentSearchData === "") {
      return;
    }
    try {
      setNotFoundFlag(false);
      setAllResultRetrieved(false);
  
      if (oldSearchData === "") {
        setOldSearchData(currentSearchData);
      }
      if (oldSearchData !== currentSearchData) {
        searchPageNumber.current = 0;
      }
  
      searchPageNumber.current++;
  
      const toastId = toast.loading("Searching...");
  
      const response = await axios.get(`${backEndApi}/jobs/search`, {
        params: { page: searchPageNumber.current, keywords: currentSearchData },
      });
  
      if (response.data.searchResult.length > 0) {
        setSearchResult((prevResults) => {
          const resultMap = new Map();
  
          prevResults.forEach((job) => resultMap.set(job._id, job));
          response.data.searchResult.forEach((job) => resultMap.set(job._id, job));
  
          return Array.from(resultMap.values()); 
        });
  
        setOldSearchData(currentSearchData);
      }
  
      if (response.data.totalResults === 0 && response.data.allResultRetrieved) {
        setNotFoundFlag(true);
        setSearchResult([]);
      }
  
      if (response.data.allResultRetrieved) {
        setAllResultRetrieved(true);
      }
  
      toast.dismiss(toastId);
  
      setSearchFlag(true);
      setCategoryFlag(false);
      setJobs([]);
      setCategory([]);
    } catch (error) {
      toast.error("Error While Searching Jobs");
      console.error("Error While Searching Jobs", error.message);
    }
  };
  
  
  useEffect(() => {
    if (searchData) {
      handleSearch(searchData);
    } else if (searchData === "" && jobPageNumber.current > 0) {
      getJobs();
    }
  }, [searchData]);
  
  useEffect(() => {
    getCategories();
    getJobs();
  }, []);
  


  return (<>
  <ToastContainer/>
    <Helmet>
      <title>
        Home Page - Welcome to the Home Page of our website!
      </title>
      </Helmet> 
    <div className="homePage ">

      <div>
        <Navbar />
      </div>

      <div className="mainContent">

        <h1>Find Your Dream Job</h1>
        <div className="searchInput" onClick={()=>handleSearch(searchData)}>
          <img src="/svg/search.svg" alt="search" />
          <input type="text" value={searchData} onChange={(e)=>setSearchData(e.target.value)} placeholder="Search for a job" />
        </div>

        <div className="categories">
          {categoriesNotFoundFlag ? <span>No Categories Found</span> : <>
            {
              categories.length === 0 ? null : categories.map((element, index) => {
                return <div className={currentCategory === element?"selected":""} onClick={currentCategory === element && allCategoryRetrieved ?null :() => getCategory(element)} key={index}>{element}</div>
              })
            }
            { categoryFlag  && <div className="allJobs" onClick={getJobs}>Back to Featured Jobs</div>}
          </>}

        </div>

        {searchFlag?<>
        
          <h2>Search Results </h2>
          <p className="saerchData">{searchData}</p>
        <div className="jobList">
          {notFoundFlag ? <span>No Job Found with this keywords</span> : <>
            {searchResult.length === 0 ?null: searchResult.map((job) => {
              return <div className="item" key={job._id}>{<JobCard job={job} />}</div>
            })
            }
          </>}
        </div>

        </>:<>
          {categoryFlag ?<>
          <h2>{currentCategory}</h2>
        <div className="jobList">
          {notFoundFlag ? <span>No Job Found in this Category</span> : <>
            {category.length === 0 ?null : category.map((elemnt) => {
              return <div className="item" key={elemnt._id}>{<JobCard job={elemnt} />}</div>
            })
            }
          </>}
        </div>
        </>:<>
        <h2>Featured Jobs</h2>
        <div className="jobList">
          {notFoundFlag ? <span>No Job Found</span> : <>
            {jobs.length === 0 ? null : jobs.map((job) => {
              return <div className="item" key={job._id}>{<JobCard job={job} />}</div>
            })
            }
          </>}
        </div>
        </>}
        </>}
      </div>

      {searchFlag?<>
        { (allResultRetrieved || searchData==="") ? <div className="loadMore noMore">
        No more results to load
      </div> : <div onClick={()=>handleSearch(searchData)} className="loadMore">
        Load more results
      </div>}      
      
      </>:<>
        {categoryFlag?<>
        {allCategoryRetrieved ? <div className="loadMore noMore">
        No more jobs to load
      </div> : <div onClick={()=>getCategory(currentCategory)} className="loadMore">
        Load more
      </div>}
      </>:<>
      {allJobRetrieved ? <div className="loadMore noMore">
        No more jobs to load
      </div> : <div onClick={getJobs} className="loadMore">
        Load more
      </div>}
      </>}
      </>}
      

      <div className="footer">
        <Footer />
      </div>


    </div>
    </>)
}
