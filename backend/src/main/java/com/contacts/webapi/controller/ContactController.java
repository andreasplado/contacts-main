package com.contacts.webapi.controller;

import com.contacts.webapi.dao.entity.ContactEntity;
import com.contacts.webapi.model.ResponseModel;
import com.contacts.webapi.service.ContactService;
import com.contacts.webapi.service.FilesStorageServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.util.*;

@RestController
@RequestMapping("/contact")
public class ContactController {

    private static String KEY_CONTACTS = "contacts";

    @Autowired
    private ContactService contactService;

    @Autowired
    FilesStorageServiceImpl storageService;

    @GetMapping
    @RequestMapping(value = "/few", method = RequestMethod.GET)
    public ResponseEntity<List<ContactEntity>> getAllContacts(
            @RequestParam(defaultValue = "0") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "id") String sortBy)
    {
        List<ContactEntity> contacts = contactService.getAllContacts(pageNo, pageSize, sortBy);

        return new ResponseEntity<>(contacts, new HttpHeaders(), HttpStatus.OK);
    }

    @GetMapping
    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public ResponseEntity<?> getAll() {
        List<ContactEntity> contacts = contactService.findAll();

        return new ResponseEntity<>(contacts, HttpStatus.OK);
    }

    @GetMapping
    @RequestMapping(value = "/all/user/{user_id}", method = RequestMethod.GET)
    public ResponseEntity<?> getAll(@PathVariable("user_id") Integer userId) {
        List<ContactEntity> contacts = contactService.findByUserId(userId);

        return new ResponseEntity<>(contacts, HttpStatus.OK);
    }

    @GetMapping
    @RequestMapping(value = "/get/{user_id}", method = RequestMethod.GET)
    public ResponseEntity<?> getByPublicValues(@RequestParam(defaultValue = "name") String name, @PathVariable("user_id") Integer userId) {
        List<ContactEntity> contacts = contactService.findByValues(name, userId);

        return new ResponseEntity<>(contacts, HttpStatus.OK);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET)
    public ResponseEntity<?> get(@PathVariable("id") Integer id) {

        Optional<ContactEntity> contact = contactService.findById(id);
        return ResponseEntity.ok(contact);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> create(@RequestBody ContactEntity contactEntity) {
        contactService.save(contactEntity);
        return ResponseEntity.ok(contactEntity);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateContact(@PathVariable("id") Integer id, @RequestBody ContactEntity contactEntity) {
        contactService.update(id, contactEntity);
        System.out.println(contactEntity.getId());
        return ResponseEntity.ok(contactEntity);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@PathVariable("id") Integer id) {

            Optional<ContactEntity> contactEntity = contactService.findById(id);
            contactService.delete(id);

            return ResponseEntity.ok(contactEntity);
    }


    @RequestMapping(value = "deleteall", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteaLL() {
        contactService.deleteAll();
        ResponseModel responseModel = new ResponseModel();
        responseModel.setMessage("Sa oled kõik kontaktid edukalt kustutanud!");

        return ResponseEntity.ok(responseModel);
    }
}