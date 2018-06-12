
exports.designInGroup = (req, res, next) => {
  const id = req.params.id;
  const page = req.params.page;
  let sort;
  if (req.params.sorting !== "null" && req.params.sorting !== undefined && req.params.sorting !== "undefined") {
    sort = req.params.sorting;
  } else {
    sort = "update";
  }

  let sql = `SELECT 
            D.uid, D.user_id, D.title, D.thumbnail, D.category_level1, D.category_level2, D.create_time, D.is_public, C.like_count, C.member_count, C.card_count, C.view_count 
            FROM group_join_design G 
              JOIN design D ON D.uid = G.design_id 
              LEFT JOIN design_counter C ON C.design_id = D.uid 
            WHERE G.parent_group_id = ${id} AND G.is_join = 1`;
  if (sort === "update") {
    sql = sql + " ORDER BY D.update_time DESC LIMIT " + (page * 10) + ", 10";
  } else if (sort === "create") {
    sql = sql + " ORDER BY D.create_time DESC LIMIT " + (page * 10) + ", 10";
  } else if (sort === "like") {
    sql = sql + " ORDER BY C.like_count DESC LIMIT " + (page * 10) + ", 10";
  }
  req.sql = sql;
  next();
};
