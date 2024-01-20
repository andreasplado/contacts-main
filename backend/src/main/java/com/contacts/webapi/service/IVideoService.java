package com.contacts.webapi.service;

import com.contacts.webapi.dao.entity.VideoEntity;

import java.util.List;
import java.util.Optional;

public interface IContactService {

    List<VideoEntity> getAllContacts(Integer pageNo, Integer pageSize, String sortBy);

    VideoEntity save (VideoEntity videoEntity);
    Optional<VideoEntity> findById(Integer id);
    List<VideoEntity> findAll();

    List<VideoEntity> findByUserId(Integer userId);

    VideoEntity update(Integer id, VideoEntity videoEntity);

    List<VideoEntity> findByValues(String name, Integer userId);

    void delete(Integer id);
    void deleteAll();
}
