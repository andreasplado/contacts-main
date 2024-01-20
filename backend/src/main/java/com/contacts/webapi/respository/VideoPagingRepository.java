package com.contacts.webapi.respository;

import com.contacts.webapi.dao.entity.VideoEntity;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactPagingRepository extends PagingAndSortingRepository<VideoEntity, Long> {
}