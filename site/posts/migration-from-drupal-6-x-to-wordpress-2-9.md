---
title: "Migration from Drupal 6.x to Wordpress 2.9x"
date: 2010-02-26
---

I recently found myself wanting to move my [personal blog](blog.scurker.com) from [Drupal 6.x](http://drupal.org) to [Wordpress](Wordpress) for various reasons. I primarily followed [this tutorial](http://socialcmsbuzz.com/convert-import-a-drupal-6-based-website-to-wordpress-v27-20052009), but wanted to outline some additional information in the transfer.

### Database Conversion Table ###

<table>
<thead>
<tr>
<th>Drupal 6.x Table(s)</th>
<th>Wordpress 2.9x Equivalent</th>
</tr>
</thead>
<tbody>
<tr>
<td>term_data, term_hierarchy</td>
<td>wp_terms</td>
</tr>
<tr>
<td>node, node_revisions</td>
<td>wp_posts</td>
</tr>
<tr>
<td>term_node</td>
<td>wp_term_relationships</td>
</tr>
<tr>
<td>comments</td>
<td>wp_comments</td>
</tr>
</tbody>
</table>

### Truncate Wordpress Tables ###

First, I needed to remove any data that is currently in certain wordpress tables so I could work with a fresh slate.

*Note:* By default when you install wordpress all tables are prefixed with `wp_` unless you changed it to something else. The below queries will need to be modified if you used anything else other than `wp_`.

```sql
TRUNCATE TABLE wp_comments;
TRUNCATE TABLE wp_postmeta;
TRUNCATE TABLE wp_posts;
TRUNCATE TABLE wp_term_relationships;
TRUNCATE TABLE wp_term_taxonomy;
TRUNCATE TABLE wp_terms;
```

### Import Taxonomy Terms ###
The next sets of queries imports taxonomy terms.

*Note:* Table names pre-pended with `drupal.` needs to be the actual name of your drupal database. You will need to change this to whatever you have your drupal database named.

```sql
INSERT INTO wp_terms (term_id, name, slug, term_group)
  SELECT d.tid, d.name, REPLACE(LOWER(d.name), ' ', '-'), 0
  FROM drupal.term_data d
  INNER JOIN drupal.term_hierarchy h
  USING(tid);
```

By default, Wordpress has several taxonomy types available; `categories`, `post_tag`, and `link_category`. In my Drupal instance I used taxonomy primarily as tags, but you may have a different need. You may need to modify the 3rd line in the below query depending on how you want taxonomies imported:

- *Categories*: `category`
- *Link Categories*: `link_category`
- *Post Tags*: `post_tag`

```sql
INSERT INTO wp_term_taxonomy (term_taxonomy_id, term_id, taxonomy,
                              description, parent)
  SELECT d.tid, d.tid, 'post_tag', d.description, h.parent
  FROM drupal.term_data d
  INNER JOIN drupal.term_hierarchy h
  USING(tid);
```

### Import Post Content ###

Drupal allows for custom post types, while as of Wordpress 2.9x, custom post types are only available via plugins. You can use the below query unmodified and it will convert all stories to posts, and everything else will transfer over as is. If you need to convert additional post types, you can add additional case statements.

Example:
`WHEN 'book' THEN 'post'`

I also adjusted the query so that 'post_date_gmt' would be populated correctly based on my GMT offset of -6:00 (Central Time). If you are in a different timezone you will need to adjust `FROM_UNIXTIME(created+21600)` to subtract or add correctly based on your location.

```sql
INSERT INTO
    wp_posts (id, post_date, post_date_gmt, post_content, post_title,
    post_excerpt, post_name, post_type, post_modified)
SELECT DISTINCT
    n.nid, FROM_UNIXTIME(created),
    FROM_UNIXTIME(created+21600), body, n.title, teaser, LOWER(n.title),
    (CASE n.type
      WHEN 'story' THEN 'post'
      ELSE n.type
    END) as type,
    FROM_UNIXTIME(changed)
FROM drupal.node n, drupal.node_revisions r
WHERE n.vid = r.vid;
```

### Import Post and Taxonomy Relationships ###

```sql
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id)
SELECT nid, tid FROM drupal.term_node;
```

### Category Count Updating ###

```sql
UPDATE wp_term_taxonomy tt
  SET count = (
    SELECT COUNT(tr.object_id)
    FROM wp_term_relationships tr
    WHERE tr.term_taxonomy_id = tt.term_taxonomy_id
  );
```

### Import Comments ###

```sql
INSERT INTO wp_comments (comment_post_ID, comment_date,
            comment_content, comment_parent, comment_author,
            comment_author_email, comment_author_url, comment_approved)
  SELECT nid, FROM_UNIXTIME(timestamp), comment, thread,
              name, mail, homepage, status
  FROM drupal.comments;
```

### Update Comment Count ###

```sql
UPDATE wp_posts
  SET comment_count = (SELECT COUNT(comment_post_id)
  FROM wp_comments
  WHERE wp_posts.id = wp_comments.comment_post_id);
```

### Update Post Slugs ###

Drupal's URL aliases is equivalent to Wordpress' permalinks. Drupal has a much more aggressive title sanitation than Wordpress. I wanted the ability to keep my titles the same for SEO reasons when migrating over to Wordpress.

In order to keep my old titles, I need to hook into Wordpress' [title sanitation](http://codex.wordpress.org/Function_Reference/sanitize_title) with similar rules to Drupal. The below code will need to be placed somewhere in the `functions.php` file of your current theme.

```php
add_filter('sanitize_title', 'my_sanitize_title');
function my_sanitize_title($title) {
  $title = preg_replace('/\b(a|an|as|at|before|but|by|for|from|is|in|into|like|of|off|on|onto|per|since|than|the|this|that|to|up|via|with)\b/i', '', $title);
  $title = preg_replace('/-+/', '-', $title);
  $title = trim($title, '-');
  return $title;
}
```

You will need to save the below code to a file i.e. "fix-slugs.php" in your main Wordpress directory and run it through your browser.

```php
<?php

  require_once('wp-load.php');

  $posts = $wpdb->get_results(
    "SELECT ID, post_title, post_name FROM $wpdb->posts"
  );

  $count = 0;
  $ignored = 0;
  $errors = 0;
  foreach($posts as $post) {
    if(strcmp($slug = sanitize_title($post->post_title), $post->post_name) !== 0) {
      $wpdb->show_errors();
      if(($result = $wpdb->query("UPDATE $wpdb->posts SET post_name='$slug' WHERE ID=$post->ID")) === false) {
        $errors++;
      } elseif($result === 0) {
        $ignore++;
      } else {
        $count++;
      }
    } else {
       $ignored++;
    }
  }

  echo "*$count post slug(s) sanitized.*<br />";
  echo "$ignored post(s) ignored.<br />";
  echo "$errors error(s).<br />";
```

If you were following along with <a href="http://socialcmsbuzz.com/convert-import-a-drupal-6-based-website-to-wordpress-v27-20052009/">this tutorial</a>, I've made a few changes based on my Drupal setup using <a href="http://codex.wordpress.org/Database_Description">Wordpress database description</a> as a reference when I ran into issues. There may be some additional steps to be completed if you uploaded images through Drupal's interface, but the above queries were able to successfully migrate my data from Drupal to Wordpress.
