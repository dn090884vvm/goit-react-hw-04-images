import { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { getPictures } from 'services/axios-api';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import Modal from './Modal/Modal';
import './App.css';

export default function App() {
  const [searchWord, setSearchWord] = useState('');
  const [page, setPage] = useState(1);
  const [pictures, setPictures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bigImage, setBigImage] = useState('');
  const [showModal, setShowmodal] = useState(false);

  const handleSearchFormSubmit = searchName => {
    setSearchWord(searchName);
    setPictures([]);
    setPage(1);
  };

  const onLoadMoreClick = () => setPage(prevPage => prevPage + 1);

  useEffect(() => {
    if (!searchWord) {
      return;
    }
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const { data } = await getPictures(searchWord, page);

        if (data.hits.length === 0) {
          alert('Sorry, there are no images we have found. Please try again');

          setIsLoading(false);
          return;
        }
        if (page > data.totalHits / 12) {
          alert('Oops, you have alredy got all pictures we have))).');

          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        setPictures(prevState => [...prevState, ...data.hits]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages();
  }, [page, searchWord]);

  const openModal = image => {
    setShowmodal(true);
    setBigImage(image);
  };

  const closeModal = () => {
    setShowmodal(false);
    setBigImage('');
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSearchFormSubmit} />
      {<ImageGallery images={pictures} onImageClick={openModal} />}
      {isLoading && (
        <div className="Load">
          <Loader />
        </div>
      )}
      {pictures.length !== 0 && <Button onLoadMoreClick={onLoadMoreClick} />}
      {showModal && (
        <Modal onClose={closeModal}>
          <img src={bigImage} alt={searchWord} />
        </Modal>
      )}
    </div>
  );
}
