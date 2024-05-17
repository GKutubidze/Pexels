'use client'
import React, { memo, useContext, useEffect, useState } from 'react';
import styles from "./ImagesContainer.module.css";
import Image from 'next/image';
import download from "../../../../public/download.svg";
import { MediaContext } from '@/app/Context/MediaContext';
import { PhotosWithTotalResults } from 'pexels';
import { getPexelsClient } from '@/app/utils/getPexelsClient';
import { handleDownload } from '@/app/utils/handleDownload';

type Props = {
    photos: PhotosWithTotalResults;
}

const ImagesContainer = (props: Props) => {
    const { photos } = props;
    const context = useContext(MediaContext);
    const [page, setPage] = useState<number>(1);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const client = getPexelsClient();

    const handleImageLoad = () => {
        context.setLoading(false);
        console.log("Image loaded successfully");
    };

    const fetchPhotos = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        try {
            const response = await client.photos.curated({ page, per_page: 15 });
            if ("photos" in response) {
                const newPhotos = response.photos.filter(
                    (newPhoto) => !photos.photos.some((existingPhoto) => existingPhoto.id === newPhoto.id)
                );
                context.setPhotos((prevPhotos) => ({
                    ...prevPhotos,
                    photos: [...prevPhotos.photos, ...newPhotos],
                }));
                setPage((prevPage) => prevPage + 1);
            } else {
                console.error("Error response:", response);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchPhotos(); // Initial fetch on mount

        const handleScroll = debounce(() => {
            if (!loadingMore && window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                fetchPhotos();
            }
        }, 200);

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []); // Empty dependency array to ensure this effect runs only once on mount

    return (
        <div className={styles.photosContainer}>
            {photos.photos.map((photo) => (
                <div key={photo.id} className={styles.photoWrapper}>
                    <div className={styles.overlay}>
                        <Image src={download} alt="" onClick={() => handleDownload(photo.src.original)} />
                    </div>
                    <Image
                        src={photo.src.original}
                        alt=""
                        width={photo.width}
                        height={photo.height}
                        className={styles.photo}
                        layout="responsive"
                        onLoad={handleImageLoad}
                        priority
                    />
                </div>
            ))}
        </div>
    );
}

export default ImagesContainer;

function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
