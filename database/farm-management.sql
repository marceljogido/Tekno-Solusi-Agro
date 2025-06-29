PGDMP  *    "                }            farm-management    17.4    17.4 T    j           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            k           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            l           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            m           1262    16388    farm-management    DATABASE     �   CREATE DATABASE "farm-management" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
 !   DROP DATABASE "farm-management";
                     postgres    false                        2615    17175    drizzle    SCHEMA        CREATE SCHEMA drizzle;
    DROP SCHEMA drizzle;
                     postgres    false            a           1247    16649    crop_status    TYPE     g   CREATE TYPE public.crop_status AS ENUM (
    'active',
    'harvested',
    'failed',
    'planned'
);
    DROP TYPE public.crop_status;
       public               postgres    false            d           1247    16658    harvest_unit_type    TYPE     f   CREATE TYPE public.harvest_unit_type AS ENUM (
    'Kilogram',
    'Ton',
    'Pieces',
    'Unit'
);
 $   DROP TYPE public.harvest_unit_type;
       public               postgres    false            g           1247    16668    start_method_type    TYPE     �   CREATE TYPE public.start_method_type AS ENUM (
    'Start in trays, transplant in ground',
    'Direct sow',
    'Seedling transplant',
    'Cutting',
    'Tuber',
    'Bulb'
);
 $   DROP TYPE public.start_method_type;
       public               postgres    false            �            1255    16471    update_updated_at_column()    FUNCTION     �   CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;
 1   DROP FUNCTION public.update_updated_at_column();
       public               postgres    false            �            1259    17177    __drizzle_migrations    TABLE     v   CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);
 )   DROP TABLE drizzle.__drizzle_migrations;
       drizzle         heap r       postgres    false    6            �            1259    17176    __drizzle_migrations_id_seq    SEQUENCE     �   CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE drizzle.__drizzle_migrations_id_seq;
       drizzle               postgres    false    229    6            n           0    0    __drizzle_migrations_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;
          drizzle               postgres    false    228            �            1259    17192    crops    TABLE     X  CREATE TABLE public.crops (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    crop_type character varying(255),
    variety character varying(255),
    start_method character varying(255),
    germination_rate numeric(5,2),
    seed_per_cell integer,
    light_profile character varying(255),
    soil_condition character varying(255),
    days_to_emerge integer,
    plant_spacing numeric(10,2),
    row_spacing numeric(10,2),
    planting_depth numeric(10,2),
    average_height numeric(10,2),
    days_to_flower integer,
    days_to_maturity integer,
    harvest_window integer,
    loss_rate numeric(5,2),
    harvest_unit character varying(50),
    estimated_revenue numeric(15,2),
    expected_yield numeric(15,2),
    planting_details text,
    pruning_details text,
    botanical_name character varying(255),
    is_perennial boolean DEFAULT false,
    auto_create_tasks boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_by integer
);
    DROP TABLE public.crops;
       public         heap r       postgres    false            �            1259    17191    crops_id_seq    SEQUENCE     �   CREATE SEQUENCE public.crops_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.crops_id_seq;
       public               postgres    false    231            o           0    0    crops_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.crops_id_seq OWNED BY public.crops.id;
          public               postgres    false    230            �            1259    17007    growth_tracking    TABLE     �  CREATE TABLE public.growth_tracking (
    id integer NOT NULL,
    planting_id integer,
    tanggal_tracking date NOT NULL,
    tahap_pertumbuhan character varying(50),
    tinggi_tanaman numeric(10,2),
    jumlah_daun integer,
    kondisi_tanaman text,
    foto_path character varying(255),
    catatan text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 #   DROP TABLE public.growth_tracking;
       public         heap r       postgres    false            �            1259    17006    growth_tracking_id_seq    SEQUENCE     �   CREATE SEQUENCE public.growth_tracking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.growth_tracking_id_seq;
       public               postgres    false    221            p           0    0    growth_tracking_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.growth_tracking_id_seq OWNED BY public.growth_tracking.id;
          public               postgres    false    220            �            1259    17023    harvests    TABLE     V  CREATE TABLE public.harvests (
    id integer NOT NULL,
    planting_id integer,
    tanggal_panen date NOT NULL,
    jumlah_panen numeric(10,2),
    kualitas character varying(50),
    catatan text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.harvests;
       public         heap r       postgres    false            �            1259    17022    harvests_id_seq    SEQUENCE     �   CREATE SEQUENCE public.harvests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.harvests_id_seq;
       public               postgres    false    223            q           0    0    harvests_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.harvests_id_seq OWNED BY public.harvests.id;
          public               postgres    false    222            �            1259    16965 	   locations    TABLE     ]  CREATE TABLE public.locations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    type character varying(50) NOT NULL,
    bed_number character varying(20),
    area_size numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.locations;
       public         heap r       postgres    false            �            1259    16964    locations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.locations_id_seq;
       public               postgres    false    219            r           0    0    locations_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;
          public               postgres    false    218            �            1259    17272    media_locations    TABLE     a  CREATE TABLE public.media_locations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    internal_id character varying(255),
    electronic_id character varying(255),
    location_type character varying(255),
    planting_format character varying(255),
    number_of_beds integer,
    bed_length numeric(10,2),
    bed_width numeric(10,2),
    panjang_lahan numeric(10,2),
    lebar_lahan numeric(10,2),
    lebar_legowo numeric(10,2),
    jarak_antar_tanaman numeric(10,2),
    jarak_antar_baris numeric(10,2),
    jumlah_baris_per_legowo integer,
    area numeric(15,4),
    luas_total_bedengan numeric(15,4),
    luas_total_jajar_legowo numeric(15,4),
    estimated_land_value numeric(15,2),
    price_per_m2 numeric(15,2),
    status character varying(255),
    light_profile character varying(255),
    grazing_rest_days integer,
    description text,
    geometry text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by integer,
    updated_by integer,
    luas_area_perhitungan numeric(15,4)
);
 #   DROP TABLE public.media_locations;
       public         heap r       postgres    false            �            1259    17271    media_locations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.media_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.media_locations_id_seq;
       public               postgres    false    235            s           0    0    media_locations_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.media_locations_id_seq OWNED BY public.media_locations.id;
          public               postgres    false    234            �            1259    17039 
   plant_care    TABLE     �  CREATE TABLE public.plant_care (
    id integer NOT NULL,
    planting_id integer,
    tanggal_perawatan date NOT NULL,
    jenis_perawatan character varying(50),
    deskripsi text,
    jumlah_bahan numeric(10,2),
    satuan character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.plant_care;
       public         heap r       postgres    false            �            1259    17038    plant_care_id_seq    SEQUENCE     �   CREATE SEQUENCE public.plant_care_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.plant_care_id_seq;
       public               postgres    false    225            t           0    0    plant_care_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.plant_care_id_seq OWNED BY public.plant_care.id;
          public               postgres    false    224            �            1259    17238 	   plantings    TABLE     H  CREATE TABLE public.plantings (
    id integer NOT NULL,
    crop_id integer,
    location_id integer,
    planting_quantity numeric(10,2),
    planting_method character varying(255),
    planting_date timestamp without time zone,
    seeding_date timestamp without time zone,
    plant_spacing numeric(10,2),
    row_spacing numeric(10,2),
    row_length numeric(10,2),
    number_of_rows integer,
    electronic_id character varying(255),
    currently_planted boolean DEFAULT false,
    harvest_plan text,
    estimated_yield numeric(15,2),
    estimated_profit numeric(15,2),
    planting_info text,
    status character varying(50) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by integer,
    updated_by integer
);
    DROP TABLE public.plantings;
       public         heap r       postgres    false            �            1259    17237    plantings_id_seq    SEQUENCE     �   CREATE SEQUENCE public.plantings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.plantings_id_seq;
       public               postgres    false    233            u           0    0    plantings_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.plantings_id_seq OWNED BY public.plantings.id;
          public               postgres    false    232            �            1259    17164    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password text NOT NULL,
    address character varying(255),
    phone character varying(30),
    profile_image character varying(255),
    background_image character varying(255),
    role character varying(50),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    17163    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    227            v           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    226            �           2604    17180    __drizzle_migrations id    DEFAULT     �   ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);
 G   ALTER TABLE drizzle.__drizzle_migrations ALTER COLUMN id DROP DEFAULT;
       drizzle               postgres    false    228    229    229            �           2604    17195    crops id    DEFAULT     d   ALTER TABLE ONLY public.crops ALTER COLUMN id SET DEFAULT nextval('public.crops_id_seq'::regclass);
 7   ALTER TABLE public.crops ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    230    231    231            �           2604    17010    growth_tracking id    DEFAULT     x   ALTER TABLE ONLY public.growth_tracking ALTER COLUMN id SET DEFAULT nextval('public.growth_tracking_id_seq'::regclass);
 A   ALTER TABLE public.growth_tracking ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    220    221            �           2604    17026    harvests id    DEFAULT     j   ALTER TABLE ONLY public.harvests ALTER COLUMN id SET DEFAULT nextval('public.harvests_id_seq'::regclass);
 :   ALTER TABLE public.harvests ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    223    223            �           2604    16968    locations id    DEFAULT     l   ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);
 ;   ALTER TABLE public.locations ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    218    219            �           2604    17275    media_locations id    DEFAULT     x   ALTER TABLE ONLY public.media_locations ALTER COLUMN id SET DEFAULT nextval('public.media_locations_id_seq'::regclass);
 A   ALTER TABLE public.media_locations ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    235    234    235            �           2604    17042    plant_care id    DEFAULT     n   ALTER TABLE ONLY public.plant_care ALTER COLUMN id SET DEFAULT nextval('public.plant_care_id_seq'::regclass);
 <   ALTER TABLE public.plant_care ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    224    225            �           2604    17241    plantings id    DEFAULT     l   ALTER TABLE ONLY public.plantings ALTER COLUMN id SET DEFAULT nextval('public.plantings_id_seq'::regclass);
 ;   ALTER TABLE public.plantings ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    233    232    233            �           2604    17167    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    227    227            a          0    17177    __drizzle_migrations 
   TABLE DATA           E   COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
    drizzle               postgres    false    229   Sv       c          0    17192    crops 
   TABLE DATA           �  COPY public.crops (id, name, crop_type, variety, start_method, germination_rate, seed_per_cell, light_profile, soil_condition, days_to_emerge, plant_spacing, row_spacing, planting_depth, average_height, days_to_flower, days_to_maturity, harvest_window, loss_rate, harvest_unit, estimated_revenue, expected_yield, planting_details, pruning_details, botanical_name, is_perennial, auto_create_tasks, created_at, updated_at, created_by, updated_by) FROM stdin;
    public               postgres    false    231   pv       Y          0    17007    growth_tracking 
   TABLE DATA           �   COPY public.growth_tracking (id, planting_id, tanggal_tracking, tahap_pertumbuhan, tinggi_tanaman, jumlah_daun, kondisi_tanaman, foto_path, catatan, created_at, updated_at) FROM stdin;
    public               postgres    false    221   w       [          0    17023    harvests 
   TABLE DATA           {   COPY public.harvests (id, planting_id, tanggal_panen, jumlah_panen, kualitas, catatan, created_at, updated_at) FROM stdin;
    public               postgres    false    223   ;w       W          0    16965 	   locations 
   TABLE DATA           b   COPY public.locations (id, name, type, bed_number, area_size, created_at, updated_at) FROM stdin;
    public               postgres    false    219   Xw       g          0    17272    media_locations 
   TABLE DATA           �  COPY public.media_locations (id, name, internal_id, electronic_id, location_type, planting_format, number_of_beds, bed_length, bed_width, panjang_lahan, lebar_lahan, lebar_legowo, jarak_antar_tanaman, jarak_antar_baris, jumlah_baris_per_legowo, area, luas_total_bedengan, luas_total_jajar_legowo, estimated_land_value, price_per_m2, status, light_profile, grazing_rest_days, description, geometry, created_at, updated_at, created_by, updated_by, luas_area_perhitungan) FROM stdin;
    public               postgres    false    235   uw       ]          0    17039 
   plant_care 
   TABLE DATA           �   COPY public.plant_care (id, planting_id, tanggal_perawatan, jenis_perawatan, deskripsi, jumlah_bahan, satuan, created_at, updated_at) FROM stdin;
    public               postgres    false    225   z       e          0    17238 	   plantings 
   TABLE DATA           P  COPY public.plantings (id, crop_id, location_id, planting_quantity, planting_method, planting_date, seeding_date, plant_spacing, row_spacing, row_length, number_of_rows, electronic_id, currently_planted, harvest_plan, estimated_yield, estimated_profit, planting_info, status, created_at, updated_at, created_by, updated_by) FROM stdin;
    public               postgres    false    233   9z       _          0    17164    users 
   TABLE DATA           �   COPY public.users (id, first_name, last_name, email, password, address, phone, profile_image, background_image, role, created_at) FROM stdin;
    public               postgres    false    227   6{       w           0    0    __drizzle_migrations_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, false);
          drizzle               postgres    false    228            x           0    0    crops_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.crops_id_seq', 5, true);
          public               postgres    false    230            y           0    0    growth_tracking_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.growth_tracking_id_seq', 1, false);
          public               postgres    false    220            z           0    0    harvests_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.harvests_id_seq', 1, false);
          public               postgres    false    222            {           0    0    locations_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.locations_id_seq', 1, false);
          public               postgres    false    218            |           0    0    media_locations_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.media_locations_id_seq', 8, true);
          public               postgres    false    234            }           0    0    plant_care_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.plant_care_id_seq', 1, false);
          public               postgres    false    224            ~           0    0    plantings_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.plantings_id_seq', 14, true);
          public               postgres    false    232                       0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 3, true);
          public               postgres    false    226            �           2606    17184 .   __drizzle_migrations __drizzle_migrations_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);
 Y   ALTER TABLE ONLY drizzle.__drizzle_migrations DROP CONSTRAINT __drizzle_migrations_pkey;
       drizzle                 postgres    false    229            �           2606    17203    crops crops_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.crops
    ADD CONSTRAINT crops_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.crops DROP CONSTRAINT crops_pkey;
       public                 postgres    false    231            �           2606    17016 $   growth_tracking growth_tracking_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.growth_tracking
    ADD CONSTRAINT growth_tracking_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.growth_tracking DROP CONSTRAINT growth_tracking_pkey;
       public                 postgres    false    221            �           2606    17032    harvests harvests_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.harvests
    ADD CONSTRAINT harvests_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.harvests DROP CONSTRAINT harvests_pkey;
       public                 postgres    false    223            �           2606    16972    locations locations_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.locations DROP CONSTRAINT locations_pkey;
       public                 postgres    false    219            �           2606    17281 $   media_locations media_locations_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.media_locations
    ADD CONSTRAINT media_locations_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.media_locations DROP CONSTRAINT media_locations_pkey;
       public                 postgres    false    235            �           2606    17048    plant_care plant_care_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.plant_care
    ADD CONSTRAINT plant_care_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.plant_care DROP CONSTRAINT plant_care_pkey;
       public                 postgres    false    225            �           2606    17249    plantings plantings_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.plantings
    ADD CONSTRAINT plantings_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.plantings DROP CONSTRAINT plantings_pkey;
       public                 postgres    false    233            �           2606    17174    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    227            �           2606    17172    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    227            �           2620    17058 1   growth_tracking update_growth_tracking_updated_at    TRIGGER     �   CREATE TRIGGER update_growth_tracking_updated_at BEFORE UPDATE ON public.growth_tracking FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
 J   DROP TRIGGER update_growth_tracking_updated_at ON public.growth_tracking;
       public               postgres    false    236    221            �           2620    17059 #   harvests update_harvests_updated_at    TRIGGER     �   CREATE TRIGGER update_harvests_updated_at BEFORE UPDATE ON public.harvests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
 <   DROP TRIGGER update_harvests_updated_at ON public.harvests;
       public               postgres    false    236    223            �           2620    17055 %   locations update_locations_updated_at    TRIGGER     �   CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
 >   DROP TRIGGER update_locations_updated_at ON public.locations;
       public               postgres    false    236    219            �           2620    17060 '   plant_care update_plant_care_updated_at    TRIGGER     �   CREATE TRIGGER update_plant_care_updated_at BEFORE UPDATE ON public.plant_care FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
 @   DROP TRIGGER update_plant_care_updated_at ON public.plant_care;
       public               postgres    false    225    236            �           2606    17204    crops crops_created_by_fkey    FK CONSTRAINT     }   ALTER TABLE ONLY public.crops
    ADD CONSTRAINT crops_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
 E   ALTER TABLE ONLY public.crops DROP CONSTRAINT crops_created_by_fkey;
       public               postgres    false    4785    227    231            �           2606    17209    crops crops_updated_by_fkey    FK CONSTRAINT     }   ALTER TABLE ONLY public.crops
    ADD CONSTRAINT crops_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
 E   ALTER TABLE ONLY public.crops DROP CONSTRAINT crops_updated_by_fkey;
       public               postgres    false    4785    227    231            �           2606    17282 /   media_locations media_locations_created_by_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.media_locations
    ADD CONSTRAINT media_locations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
 Y   ALTER TABLE ONLY public.media_locations DROP CONSTRAINT media_locations_created_by_fkey;
       public               postgres    false    227    4785    235            �           2606    17287 /   media_locations media_locations_updated_by_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.media_locations
    ADD CONSTRAINT media_locations_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);
 Y   ALTER TABLE ONLY public.media_locations DROP CONSTRAINT media_locations_updated_by_fkey;
       public               postgres    false    235    4785    227            �           2606    17260 *   plantings plantings_created_by_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.plantings
    ADD CONSTRAINT plantings_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);
 T   ALTER TABLE ONLY public.plantings DROP CONSTRAINT plantings_created_by_users_id_fk;
       public               postgres    false    233    4785    227            �           2606    17250 '   plantings plantings_crop_id_crops_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.plantings
    ADD CONSTRAINT plantings_crop_id_crops_id_fk FOREIGN KEY (crop_id) REFERENCES public.crops(id);
 Q   ALTER TABLE ONLY public.plantings DROP CONSTRAINT plantings_crop_id_crops_id_fk;
       public               postgres    false    231    233    4789            �           2606    17265 *   plantings plantings_updated_by_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.plantings
    ADD CONSTRAINT plantings_updated_by_users_id_fk FOREIGN KEY (updated_by) REFERENCES public.users(id);
 T   ALTER TABLE ONLY public.plantings DROP CONSTRAINT plantings_updated_by_users_id_fk;
       public               postgres    false    4785    233    227            a      x������ � �      c   �   x�-��
�0���S�ZҴ�܎�Lv�q֪�2���-��'����m �xY��:E0�G�e�s��@�5"8��w^�<��v�~�>ٮ�J�caQ�M�2��y|��;,<�E,~A��@H^�WTIc[k[��w�u��$6-���tU�g�8k!�-�      Y      x������ � �      [      x������ � �      W      x������ � �      g   �  x��T]KQ}^Eȳ����y+}(-�}T)kMc�lJ>(R��;��Y�,�����a��9G����nF�����W���궾�W��f���eL�[��U��O_Q�
틮Ж��q����< �߼��Y��>כ<t��͚�MW�o��������~�l�������z�ԛ�z<=??G���J8����h P�<�qX�����q>䲃I�/+v�
��Ȏ1��bn"����a����˿�	�	�l�8U�p��:���ˑU��n�JI��*���Z����j�����*��g:t?EI_hpZ/��~�
�n���@���%C$�'E���`��!�&��^Ԇvl�/�(ޫ��R4z��� �P�@S�	��w*x�a{]?�߼�{��G=����:�̚y}3��/��TS�ґ�YIo0Ko@�����0n*�^z--P�Zx�	����v� 	V��C>�pb��;�ˤ��U��E�U2�~�rNp�/=��B�H���#K����8�L����LJS��0�`��^��?�<ȳ]1+.}�9T� ��X�M�p{"��D��T��O�)ʑ6c�G����ƒ�l/����gۓȅ��sB{N�I<�]}�;Q� &;X��brtt��J}�      ]      x������ � �      e   �   x�u��N�0���S�9���9��a�ap�Š�uZR�u��Iǀ����g�ׯ,(��$"<��='�rꎧԁFmKt%6�_��������<��]٦�X�H:�acjs��1��Ś�<�6t�ǰM�6���J����s"��mx�ϾD2����O��^(Y�Z��wKJ�[���{Ŋ���G��GV�n���Mg3s���S�����xm����Wk�A���ʢ(>�m;      _   (  x�}ιr�P ��������TQ"I�a�66Y�\��3Nb3��s�S}��*n�L�6�AuY9�� ~�� ���}�x�E����E����m�K�I�jۥ9����pvڲ�i߮7����V��`��� T��)"�*��K�)C�!f=�z�u�1�)����x�[�!�4A"��������mc����e�x�uܯX9�ӤX����'�<7�����:�Dӱ*�L�*��Ov�i�z&��������S9S���i�<��F2k�|�A�:�yД�9�ˌ3i�J�$�`]�S     