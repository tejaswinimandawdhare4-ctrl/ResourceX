import { Request, Response } from "express";
import pool from "../config/database";

// =====================================================
// GET ALL RESOURCES
// GET /api/resources
// =====================================================

export const getResources = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      city,
      category,
      status,
      minPrice,
      maxPrice,
      minQuantity,
      search
    } = req.query;

    let sql = `
      SELECT
        r.*,
        b.business_name,
        b.business_type,
        b.location AS business_location,
        b.rating AS business_rating,
        b.is_verified
      FROM resources r
      JOIN businesses b
        ON r.business_id = b.id
      WHERE 1 = 1
    `;

    const params: any[] = [];

    // City filter
    if (city) {
      sql += ` AND r.city = ?`;
      params.push(city);
    }

    // Category filter
    if (category) {
      sql += ` AND r.category = ?`;
      params.push(category);
    }

    // Status filter
    if (status) {
      sql += ` AND r.status = ?`;
      params.push(status);
    }

    // Minimum price
    if (minPrice) {
      sql += ` AND r.price >= ?`;
      params.push(Number(minPrice));
    }

    // Maximum price
    if (maxPrice) {
      sql += ` AND r.price <= ?`;
      params.push(Number(maxPrice));
    }

    // Minimum quantity
    if (minQuantity) {
      sql += ` AND r.quantity >= ?`;
      params.push(Number(minQuantity));
    }

    // Search resource name
    if (search) {
      sql += `
        AND (
          r.resource_name LIKE ?
          OR r.description LIKE ?
          OR r.category LIKE ?
          OR b.business_name LIKE ?
        )
      `;

      const searchValue = `%${search}%`;

      params.push(
        searchValue,
        searchValue,
        searchValue,
        searchValue
      );
    }

    sql += ` ORDER BY r.created_at DESC`;

    const [rows] = await pool.query(sql, params);

    res.status(200).json({
      success: true,
      count: (rows as any[]).length,
      resources: rows
    });

  } catch (error) {
    console.error("Get resources error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resources"
    });
  }
};


// =====================================================
// GET SINGLE RESOURCE
// GET /api/resources/:id
// =====================================================

export const getResourceById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        r.*,
        b.business_name,
        b.business_type,
        b.location AS business_location,
        b.city AS business_city,
        b.state AS business_state,
        b.pincode AS business_pincode,
        b.rating AS business_rating,
        b.total_reviews,
        b.is_verified,
        b.contact_phone
      FROM resources r
      JOIN businesses b
        ON r.business_id = b.id
      WHERE r.id = ?
      `,
      [id]
    );

    const resources = rows as any[];

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }

    // Get images
    const [images] = await pool.query(
      `
      SELECT
        id,
        image_url,
        is_primary,
        sort_order
      FROM resource_images
      WHERE resource_id = ?
      ORDER BY sort_order ASC
      `,
      [id]
    );

    // Get availability
    const [availability] = await pool.query(
      `
      SELECT
        id,
        available_date,
        start_time,
        end_time,
        available_quantity,
        status
      FROM availability
      WHERE resource_id = ?
      ORDER BY available_date ASC, start_time ASC
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      resource: {
        ...resources[0],
        images,
        availability
      }
    });

  } catch (error) {
    console.error("Get resource error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resource"
    });
  }
};


// =====================================================
// CREATE RESOURCE
// POST /api/resources
// =====================================================

export const createResource = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      business_id,
      resource_name,
      category,
      description,
      quantity,
      capacity,
      price,
      price_unit,
      minimum_rental_period,
      delivery_available,
      pickup_available,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      status,
      is_featured
    } = req.body;

    // Required field validation
    if (
      !business_id ||
      !resource_name ||
      !category ||
      quantity === undefined ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "business_id, resource_name, category, quantity and price are required"
      });
    }

    // Check business exists
    const [business] = await pool.query(
      `
      SELECT id
      FROM businesses
      WHERE id = ?
      `,
      [business_id]
    );

    if ((business as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO resources
      (
        business_id,
        resource_name,
        category,
        description,
        quantity,
        capacity,
        price,
        price_unit,
        minimum_rental_period,
        delivery_available,
        pickup_available,
        address,
        city,
        state,
        pincode,
        latitude,
        longitude,
        status,
        is_featured
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        business_id,
        resource_name,
        category,
        description || null,
        quantity,
        capacity || null,
        price,
        price_unit || "PER_EVENT",
        minimum_rental_period || 1,
        delivery_available ?? false,
        pickup_available ?? true,
        address || null,
        city || null,
        state || null,
        pincode || null,
        latitude || null,
        longitude || null,
        status || "ACTIVE",
        is_featured ?? false
      ]
    );

    const insertResult = result as any;

    res.status(201).json({
      success: true,
      message: "Resource created successfully",
      resource_id: insertResult.insertId
    });

  } catch (error) {
    console.error("Create resource error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create resource"
    });
  }
};


// =====================================================
// UPDATE RESOURCE
// PUT /api/resources/:id
// =====================================================

export const updateResource = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      resource_name,
      category,
      description,
      quantity,
      capacity,
      price,
      price_unit,
      minimum_rental_period,
      delivery_available,
      pickup_available,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      status,
      is_featured
    } = req.body;

    // Check resource exists
    const [existing] = await pool.query(
      `
      SELECT id
      FROM resources
      WHERE id = ?
      `,
      [id]
    );

    if ((existing as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }

    await pool.query(
      `
      UPDATE resources
      SET
        resource_name = ?,
        category = ?,
        description = ?,
        quantity = ?,
        capacity = ?,
        price = ?,
        price_unit = ?,
        minimum_rental_period = ?,
        delivery_available = ?,
        pickup_available = ?,
        address = ?,
        city = ?,
        state = ?,
        pincode = ?,
        latitude = ?,
        longitude = ?,
        status = ?,
        is_featured = ?
      WHERE id = ?
      `,
      [
        resource_name,
        category,
        description || null,
        quantity,
        capacity || null,
        price,
        price_unit,
        minimum_rental_period,
        delivery_available,
        pickup_available,
        address || null,
        city || null,
        state || null,
        pincode || null,
        latitude || null,
        longitude || null,
        status,
        is_featured,
        id
      ]
    );

    res.status(200).json({
      success: true,
      message: "Resource updated successfully"
    });

  } catch (error) {
    console.error("Update resource error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update resource"
    });
  }
};


// =====================================================
// DELETE RESOURCE
// DELETE /api/resources/:id
// =====================================================

export const deleteResource = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Check resource exists
    const [existing] = await pool.query(
      `
      SELECT id
      FROM resources
      WHERE id = ?
      `,
      [id]
    );

    if ((existing as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      });
    }

    await pool.query(
      `
      DELETE FROM resources
      WHERE id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Resource deleted successfully"
    });

  } catch (error) {
    console.error("Delete resource error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete resource"
    });
  }
};