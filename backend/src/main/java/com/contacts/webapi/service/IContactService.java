package com.contacts.webapi.service;

import com.contacts.webapi.dao.entity.ContactEntity;

import java.util.List;
import java.util.Optional;

public interface IContactService {

    List<ContactEntity> getAllContacts(Integer pageNo, Integer pageSize, String sortBy);

    ContactEntity save (ContactEntity contactEntity);
    Optional<ContactEntity> findById(Integer id);
    List<ContactEntity> findAll();

    List<ContactEntity> findByUserId(Integer userId);

    ContactEntity update(Integer id, ContactEntity contactEntity);

    List<ContactEntity> findByValues(String name, Integer userId);

    void delete(Integer id);
    void deleteAll();
}
