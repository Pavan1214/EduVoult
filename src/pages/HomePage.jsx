import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCard from '../components/uploads/ImageCard';
import Pagination from '../components/common/Pagination';
import { getUploads } from '../services/api';
import AnimatedPage from '../utils/AnimatedPage';

const HomePage = ({ searchTerm, setIsSearchVisible }) => {
  const [allUploads, setAllUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    group: 'All',
    year: 'All',
    subject: 'All',
    semester: 'All',
  });
  const imagesPerPage = 20;

  // Effect to fetch data from the backend when the component first loads
  useEffect(() => {
    const fetchUploads = async () => {
      try {
        setLoading(true);
        const { data } = await getUploads();
        setAllUploads(data);
      } catch (err) {
        setError('Could not fetch uploads. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, []); // The empty array [] means this runs only once.

  // --- Helper Functions ---
  const handleFilterChange = (category, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [category]: value,
    }));
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // --- Effects for State Management ---
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when search or filters change
  }, [searchTerm, filters]);

  useEffect(() => {
    setIsSearchVisible(currentPage === 1); // Hide search bar on other pages
  }, [currentPage, setIsSearchVisible]);

  // --- Generate Filter Options from Fetched Data ---
  const groups = ['All', ...new Set(allUploads.map(upload => upload.group))];
  const subjects = ['All', ...new Set(allUploads.map(upload => upload.subject))];
  const semesters = ['All', ...new Set(allUploads.map(upload => upload.semester.toString()))].sort();
  const years = ['All', '1st', '2nd', '3rd'];

  // --- Data Processing (Search, Filter, Paginate) ---
  const filteredImages = allUploads
    .filter(image => {
      const search = searchTerm.toLowerCase();
      if (!search) return true;
      return (
        (image.uploader?.displayName || '').toLowerCase().includes(search) ||
        image.subject.toLowerCase().includes(search) ||
        image.semester.toLowerCase().includes(search) ||
        image.group.toLowerCase().includes(search) ||
        image.year.toLowerCase().includes(search)
      );
    })
    .filter(image => {
      return (
        (filters.group === 'All' || image.group === filters.group) &&
        (filters.year === 'All' || image.year === filters.year) &&
        (filters.subject === 'All' || image.subject === filters.subject) &&
        (filters.semester === 'All' || image.semester === filters.semester)
      );
    });

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);

  // --- Render Logic ---
  if (loading) {
    return <AnimatedPage><p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading resources...</p></AnimatedPage>;
  }

  if (error) {
    return <AnimatedPage><p style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>{error}</p></AnimatedPage>;
  }

  return (
    <AnimatedPage>
      {currentPage === 1 && (
        <div className="filter-bar-container">
          <div className="filter-group">
            <label htmlFor="group-filter" className="filter-label">Group</label>
            <select id="group-filter" className="filter-dropdown" value={filters.group} onChange={(e) => handleFilterChange('group', e.target.value)}>
              {groups.map(group => <option key={group} value={group}>{group}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="year-filter" className="filter-label">Year</label>
            <select id="year-filter" className="filter-dropdown" value={filters.year} onChange={(e) => handleFilterChange('year', e.target.value)}>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="subject-filter" className="filter-label">Subject</label>
            <select id="subject-filter" className="filter-dropdown" value={filters.subject} onChange={(e) => handleFilterChange('subject', e.target.value)}>
              {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="semester-filter" className="filter-label">Semester</label>
            <select id="semester-filter" className="filter-dropdown" value={filters.semester} onChange={(e) => handleFilterChange('semester', e.target.value)}>
              {semesters.map(semester => <option key={semester} value={semester}>{semester}</option>)}
            </select>
          </div>
        </div>
      )}

      <h1 className="homepage-title">___</h1>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage + searchTerm + JSON.stringify(filters)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="homepage-grid"
        >
          {currentImages.length > 0 ? (
            currentImages.map(upload => (
              <div key={upload._id} className="grid-item">
                <ImageCard upload={upload} />
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>No results found. Try adjusting your search or filters.</p>
          )}
        </motion.div>
      </AnimatePresence>

      {filteredImages.length > imagesPerPage && (
        <Pagination
          imagesPerPage={imagesPerPage}
          totalImages={filteredImages.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
    </AnimatedPage>
  );
};

export default HomePage;