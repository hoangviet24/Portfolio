const technologyDialog = document.querySelector("#technologyDialog");
      const technologyTitle = document.querySelector("#technologyDialogTitle");
      const technologyCategory = document.querySelector(
        "#technologyDialogCategory",
      );
      const technologyBody = document.querySelector(".technology-dialog-body");
      document.querySelectorAll(".skill-toggle").forEach((card) =>
        card.addEventListener("click", () => {
          technologyTitle.textContent = card.querySelector("h3").textContent;
          technologyCategory.textContent =
            card.querySelector(".skill-num").textContent;
          technologyBody.innerHTML =
            card.querySelector(".skill-details").innerHTML;
          document
            .querySelectorAll(".skill-toggle")
            .forEach((item) => item.setAttribute("aria-expanded", "false"));
          card.setAttribute("aria-expanded", "true");
          technologyDialog.showModal();
        }),
      );
      technologyDialog
        .querySelector(".dialog-close")
        .addEventListener("click", () => {
          technologyDialog.close();
          document
            .querySelectorAll(".skill-toggle")
            .forEach((item) => item.setAttribute("aria-expanded", "false"));
        });
      technologyDialog.addEventListener("click", (e) => {
        if (e.target === technologyDialog) {
          technologyDialog.close();
          document
            .querySelectorAll(".skill-toggle")
            .forEach((item) => item.setAttribute("aria-expanded", "false"));
        }
      });
      technologyDialog.addEventListener("close", () =>
        document
          .querySelectorAll(".skill-toggle")
          .forEach((item) => item.setAttribute("aria-expanded", "false")),
      );
      const contactDialog = document.querySelector("#contactDialog");
      document
        .querySelectorAll("[data-contact-open]")
        .forEach((btn) =>
          btn.addEventListener("click", () => contactDialog.showModal()),
        );
      contactDialog
        .querySelector(".dialog-close")
        .addEventListener("click", () => contactDialog.close());
      contactDialog.addEventListener("click", (e) => {
        if (e.target === contactDialog) contactDialog.close();
      });
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              observer.unobserve(e.target);
            }
          }),
        { threshold: 0.12 },
      );
      document
        .querySelectorAll(".reveal")
        .forEach((el) => observer.observe(el));
      (async () => {
        const canvas = document.querySelector("#scene"),
          fallback = document.querySelector("#fallbackOrb");
        try {
          const THREE = await import("three");
          const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
          });
          renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
          renderer.setSize(canvas.clientWidth, canvas.clientHeight);
          renderer.setClearColor(0x000000, 0);
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(
            48,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            100,
          );
          camera.position.z = 9;
          const group = new THREE.Group();
          group.position.set(2.45, 0.1, 0);
          scene.add(group);
          const core = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.15, 2),
            new THREE.MeshBasicMaterial({
              color: 0xc8ff36,
              wireframe: true,
              transparent: true,
              opacity: 0.7,
            }),
          );
          group.add(core);
          const inner = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.76, 1),
            new THREE.MeshBasicMaterial({
              color: 0x52e8d1,
              wireframe: true,
              transparent: true,
              opacity: 0.48,
            }),
          );
          group.add(inner);
          for (let i = 0; i < 3; i++) {
            const ring = new THREE.Mesh(
              new THREE.TorusGeometry(1.55 + i * 0.13, 0.006, 4, 180),
              new THREE.MeshBasicMaterial({
                color: i === 1 ? 0xc8ff36 : 0x52e8d1,
                transparent: true,
                opacity: 0.55,
              }),
            );
            ring.rotation.x = 0.7 + i * 0.48;
            ring.rotation.y = i * 0.58;
            group.add(ring);
          }
          const pointsCount = 650,
            positions = new Float32Array(pointsCount * 3);
          for (let i = 0; i < pointsCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 18;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
          }
          const geo = new THREE.BufferGeometry();
          geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
          const dust = new THREE.Points(
            geo,
            new THREE.PointsMaterial({
              color: 0x8da7a0,
              size: 0.018,
              transparent: true,
              opacity: 0.55,
            }),
          );
          scene.add(dust);
          const grid = new THREE.GridHelper(22, 44, 0x52e8d1, 0x34423f);
          grid.position.set(0, -2.9, -2);
          grid.material.transparent = true;
          grid.material.opacity = 0.12;
          scene.add(grid);
          let mx = 0,
            my = 0,
            tx = 0,
            ty = 0;
          addEventListener(
            "pointermove",
            (e) => {
              mx = (e.clientX / innerWidth - 0.5) * 0.35;
              my = (e.clientY / innerHeight - 0.5) * 0.25;
            },
            { passive: true },
          );
          function resize() {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            group.scale.setScalar(width < 560 ? 0.72 : 1);
            group.position.x = width < 560 ? 0.2 : 0.55;
            group.position.y = width < 560 ? 1.25 : 0.1;
          }
          addEventListener("resize", resize);
          resize();
          fallback.style.display = "none";
          const clock = new THREE.Clock();
          function animate() {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            tx += (mx - tx) * 0.025;
            ty += (my - ty) * 0.025;
            group.rotation.y = t * 0.12 + tx;
            group.rotation.x = Math.sin(t * 0.18) * 0.11 + ty;
            inner.rotation.x = -t * 0.15;
            inner.rotation.y = t * 0.19;
            dust.rotation.y = t * 0.008;
            renderer.render(scene, camera);
          }
          animate();
        } catch (e) {
          console.warn(
            "Three.js could not load; using the CSS orb fallback.",
            e,
          );
        }
      })();