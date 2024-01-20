package com.contacts.webapi.respository;

import com.contacts.webapi.dao.entity.VideoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<VideoEntity, Integer> {
    @Query(value="SELECT c.* FROM contacts c WHERE (c.name LIKE %?1% OR c.phone LIKE %?1%) AND c.userid=?2", nativeQuery = true)
    List<VideoEntity> findByValues(String name, Integer userId);

    @Query(value="SELECT c.* FROM contacts c WHERE c.userid=?1", nativeQuery = true)
    List<VideoEntity> findByUserId(Integer name);
}