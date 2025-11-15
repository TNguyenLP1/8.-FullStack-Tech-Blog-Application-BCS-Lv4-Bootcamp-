import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

const POSTS_URL = '/posts';
const CATEGORIES_URL = '/categories';

export async function fetchPosts(categoryId = null) {
  try {
    const path = categoryId ? `${POSTS_URL}?category=${categoryId}` : POSTS_URL;
    return await apiGet(path);
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createPost(data) {
  try {
    return await apiPost(POSTS_URL, data);
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
}

export async function updatePost(id, data) {
  try {
    return await apiPut(`${POSTS_URL}/${id}`, data);
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
}

export async function deletePost(id) {
  try {
    return await apiDelete(`${POSTS_URL}/${id}`);
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
}

export async function fetchCategories() {
  try {
    return await apiGet(CATEGORIES_URL);
  } catch (err) {
    console.error(err);
    return [];
  }
}
