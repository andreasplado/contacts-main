package com.contacts.webapi.service;

import com.contacts.webapi.dao.entity.VideoEntity;
import com.contacts.webapi.respository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VideoService implements IVideoService {

    @Autowired
    private VideoRepository repository;

    @Override
    public List<VideoEntity> getAllContacts(Integer pageNo, Integer pageSize, String sortBy)
    {
        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(sortBy));
        Page<VideoEntity> pagedResult = repository.findAll(paging);

        if(pagedResult.hasContent()) {
            return pagedResult.getContent();
        } else {
            return new ArrayList<>();
        }
    }

    @Override
    public VideoEntity save(VideoEntity videoEntity, MultipartFile file) throws Exception {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {

            if(fileName.contains("..")) {
                throw  new Exception("Filename contains invalid path sequence " + fileName);
            }
            if (file.getBytes().length > (1024 * 1024)) {
                throw new Exception("File size exceeds maximum limit");
            }
            VideoEntity video = new VideoEntity(file.getBytes(), videoEntity.getTitle(), videoEntity.getDescription(), videoEntity.getTags());
            return repository.save(video);
        } catch (MaxUploadSizeExceededException e) {
            throw new MaxUploadSizeExceededException(file.getSize());
        } catch (Exception e) {
            throw new Exception("Could not save File: " + fileName);
        }
    }
    @Override
    public Optional<VideoEntity> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public List<VideoEntity> findAll() {
        return repository.findAll();
    }

    @Override
    public List<VideoEntity> findByUserId(Integer userId) {
        return repository.findByUserId(userId);
    }

    @Override
    public VideoEntity update(Integer id, VideoEntity videoEntity) {
        System.out.println(videoEntity.getTitle());
        if(repository.existsById(id)){
            repository.save(videoEntity);
        }
        return videoEntity;
    }

    @Override
    public List<VideoEntity> findByValues(String name, Integer userId) {
        return repository.findByValues(name, userId);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public void deleteAll() {
        repository.deleteAll();
    }

}