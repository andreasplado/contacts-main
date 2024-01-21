package com.contacts.webapi.controller;

import com.contacts.webapi.dao.entity.VideoEntity;
import com.contacts.webapi.model.ResponseModel;
import com.contacts.webapi.service.VideoService;
import com.contacts.webapi.service.FilesStorageServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/contact")
public class VideoController {

    private static String KEY_CONTACTS = "contacts";

    @Autowired
    private VideoService videoService;

    @Autowired
    FilesStorageServiceImpl storageService;

    @GetMapping
    @RequestMapping(value = "/few", method = RequestMethod.GET)
    public ResponseEntity<List<VideoEntity>> getAllContacts(
            @RequestParam(defaultValue = "0") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "id") String sortBy)
    {
        List<VideoEntity> contacts = videoService.getAllContacts(pageNo, pageSize, sortBy);

        return new ResponseEntity<>(contacts, new HttpHeaders(), HttpStatus.OK);
    }

    @GetMapping
    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public ResponseEntity<?> getAll() {
        List<VideoEntity> contacts = videoService.findAll();

        return new ResponseEntity<>(contacts, HttpStatus.OK);
    }

    @GetMapping
    @RequestMapping(value = "/all/user/{user_id}", method = RequestMethod.GET)
    public ResponseEntity<?> getAll(@PathVariable("user_id") Integer userId) {
        List<VideoEntity> videos = videoService.findByUserId(userId);

        return new ResponseEntity<>(videos, HttpStatus.OK);
    }

    @GetMapping
    @RequestMapping(value = "/get/{user_id}", method = RequestMethod.GET)
    public ResponseEntity<?> getByPublicValues(@RequestParam(defaultValue = "name") String name, @PathVariable("user_id") Integer userId) {
        List<VideoEntity> contacts = videoService.findByValues(name, userId);

        return new ResponseEntity<>(contacts, HttpStatus.OK);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET)
    public ResponseEntity<?> get(@PathVariable("id") Integer id) {

        Optional<VideoEntity> contact = videoService.findById(id);
        return ResponseEntity.ok(contact);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> create(@RequestBody VideoEntity videoEntity, @RequestParam("file") MultipartFile file) throws Exception{
        videoService.save(videoEntity, file);
        return ResponseEntity.ok(videoEntity);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateContact(@PathVariable("id") Integer id, @RequestBody VideoEntity videoEntity) {
        videoService.update(id, videoEntity);
        System.out.println(videoEntity.getId());
        return ResponseEntity.ok(videoEntity);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@PathVariable("id") Integer id) {

            Optional<VideoEntity> contactEntity = videoService.findById(id);
            videoService.delete(id);

            return ResponseEntity.ok(contactEntity);
    }


    @RequestMapping(value = "deleteall", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteaLL() {
        videoService.deleteAll();
        ResponseModel responseModel = new ResponseModel();
        responseModel.setMessage("Sa oled kõik kontaktid edukalt kustutanud!");

        return ResponseEntity.ok(responseModel);
    }
}